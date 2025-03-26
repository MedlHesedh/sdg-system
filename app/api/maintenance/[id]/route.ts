import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/utils/supabase/server"

// PATCH /api/maintenance/[id] - Update a maintenance schedule
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body

    const supabase = createServerSupabaseClient()

    // Get the current maintenance schedule
    const { data: currentSchedule, error: fetchError } = await supabase
      .from("maintenance_schedules")
      .select(`
        *,
        tool_serial_numbers(id, serial_number, status)
      `)
      .eq("id", params.id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Update the maintenance schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from("maintenance_schedules")
      .update({ status })
      .eq("id", params.id)
      .select()
      .single()

    if (scheduleError) {
      throw scheduleError
    }

    // If status is Completed, update the tool status and last_maintenance date
    if (status === "Completed") {
      // Update the serial number status
      const { error: serialNumberError } = await supabase
        .from("tool_serial_numbers")
        .update({
          status: "Available",
        })
        .eq("id", currentSchedule.serial_number_id)

      if (serialNumberError) {
        throw serialNumberError
      }

      // Update the tool's last_maintenance date
      const { error: toolError } = await supabase
        .from("tools")
        .update({
          last_maintenance: new Date().toISOString().split("T")[0],
        })
        .eq("id", currentSchedule.tool_id)

      if (toolError) {
        throw toolError
      }

      // Check if all serial numbers for this tool are now available
      const { data: serialNumbers, error: fetchSerialError } = await supabase
        .from("tool_serial_numbers")
        .select("status")
        .eq("tool_id", currentSchedule.tool_id)

      if (fetchSerialError) {
        throw fetchSerialError
      }

      const allAvailable = serialNumbers.every((sn) => sn.status === "Available")

      if (allAvailable) {
        const { error: toolStatusError } = await supabase
          .from("tools")
          .update({ status: "Available" })
          .eq("id", currentSchedule.tool_id)

        if (toolStatusError) {
          throw toolStatusError
        }
      }
    }

    // If status is Cancelled and the tool was under maintenance for this schedule,
    // check if there are other active maintenance schedules for this tool
    if (status === "Cancelled" && currentSchedule.tool_serial_numbers.status === "Under Maintenance") {
      const { data: activeSchedules, error: activeError } = await supabase
        .from("maintenance_schedules")
        .select()
        .eq("serial_number_id", currentSchedule.serial_number_id)
        .in("status", ["Scheduled", "In Progress"])

      if (activeError) {
        throw activeError
      }

      // If no other active schedules, set the tool status back to Available
      if (activeSchedules.length === 0) {
        const { error: serialNumberError } = await supabase
          .from("tool_serial_numbers")
          .update({ status: "Available" })
          .eq("id", currentSchedule.serial_number_id)

        if (serialNumberError) {
          throw serialNumberError
        }

        // Check if all serial numbers for this tool are now available
        const { data: serialNumbers, error: fetchSerialError } = await supabase
          .from("tool_serial_numbers")
          .select("status")
          .eq("tool_id", currentSchedule.tool_id)

        if (fetchSerialError) {
          throw fetchSerialError
        }

        const allAvailable = serialNumbers.every((sn) => sn.status === "Available")

        if (allAvailable) {
          const { error: toolStatusError } = await supabase
            .from("tools")
            .update({ status: "Available" })
            .eq("id", currentSchedule.tool_id)

          if (toolStatusError) {
            throw toolStatusError
          }
        }
      }
    }

    return NextResponse.json({ schedule })
  } catch (error) {
    console.error(`Error updating maintenance schedule ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update maintenance schedule" }, { status: 500 })
  }
}

