import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/utils/supabase/server"

// PATCH /api/maintenance/[id] - Update a maintenance schedule
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const scheduleId = context.params.id

  try {
    const { status } = await request.json()

    // Fetch current maintenance schedule
    const currentSchedule = await fetchCurrentSchedule(supabase, scheduleId)

    // Update maintenance schedule status
    const schedule = await updateMaintenanceSchedule(supabase, scheduleId, status)

    // Handle status-specific updates
    if (status === "Completed") {
      await handleCompletedStatus(supabase, currentSchedule)
    } else if (status === "Cancelled") {
      await handleCancelledStatus(supabase, currentSchedule)
    }

    return NextResponse.json({ schedule })
  } catch (error) {
    console.error(`Error updating maintenance schedule ${scheduleId}:`, error)
    return NextResponse.json({ error: "Failed to update maintenance schedule" }, { status: 500 })
  }
}

// Fetch current maintenance schedule
async function fetchCurrentSchedule(supabase: any, scheduleId: string) {
  const { data, error } = await supabase
    .from("maintenance_schedules")
    .select(`
      *,
      tool_serial_numbers(id, serial_number, status)
    `)
    .eq("id", scheduleId)
    .single()

  if (error) throw error
  return data
}

// Update maintenance schedule status
async function updateMaintenanceSchedule(supabase: any, scheduleId: string, status: string) {
  const { data, error } = await supabase
    .from("maintenance_schedules")
    .update({ status })
    .eq("id", scheduleId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Handle updates when maintenance is completed
async function handleCompletedStatus(supabase: any, currentSchedule: any) {
  // Update serial number status
  await supabase
    .from("tool_serial_numbers")
    .update({ status: "Available" })
    .eq("id", currentSchedule.serial_number_id)

  // Update tool's last maintenance date
  await supabase
    .from("tools")
    .update({
      last_maintenance: new Date().toISOString().split("T")[0],
    })
    .eq("id", currentSchedule.tool_id)

  // Check if all serial numbers are available
  const { data: serialNumbers } = await supabase
    .from("tool_serial_numbers")
    .select("status")
    .eq("tool_id", currentSchedule.tool_id)

  const allAvailable = serialNumbers.every((sn: any) => sn.status === "Available")

  // Update tool status if all serial numbers are available
  if (allAvailable) {
    await supabase
      .from("tools")
      .update({ status: "Available" })
      .eq("id", currentSchedule.tool_id)
  }
}

// Handle updates when maintenance is cancelled
async function handleCancelledStatus(supabase: any, currentSchedule: any) {
  // Only proceed if the tool was under maintenance
  if (currentSchedule.tool_serial_numbers.status !== "Under Maintenance") return

  // Check for other active maintenance schedules
  const { data: activeSchedules } = await supabase
    .from("maintenance_schedules")
    .select()
    .eq("serial_number_id", currentSchedule.serial_number_id)
    .in("status", ["Scheduled", "In Progress"])

  // If no other active schedules, update serial number and potentially tool status
  if (activeSchedules.length === 0) {
    await supabase
      .from("tool_serial_numbers")
      .update({ status: "Available" })
      .eq("id", currentSchedule.serial_number_id)

    // Check if all serial numbers are available
    const { data: serialNumbers } = await supabase
      .from("tool_serial_numbers")
      .select("status")
      .eq("tool_id", currentSchedule.tool_id)

    const allAvailable = serialNumbers.every((sn: any) => sn.status === "Available")

    // Update tool status if all serial numbers are available
    if (allAvailable) {
      await supabase
        .from("tools")
        .update({ status: "Available" })
        .eq("id", currentSchedule.tool_id)
    }
  }
}