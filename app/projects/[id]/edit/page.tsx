// import { ProjectForm } from "@/components/project-form"

// // Sample project data - in a real app, you would fetch this from an API
// // const projectsData = [
// //   {
// //     id: "1",
// //     name: "Greenview Residence",
// //     type: "Two-storey Residence",
// //     client: "John Smith",
// //     dateRequested: "2025-02-15",
// //     targetDate: "2025-08-20",
// //     status: "In Progress",
// //   },
// //   {
// //     id: "2",
// //     name: "Skyline Apartments",
// //     type: "Two-Storey Apartment with Roofdeck",
// //     client: "Sarah Johnson",
// //     dateRequested: "2025-01-10",
// //     targetDate: "2025-07-15",
// //     status: "Planning",
// //   },
// // ]

// export default function EditProjectPage({ params }: { params: { id: string } }) {
//   // In a real app, you would fetch this data from an API
//   const project = projectsData.find((p) => p.id === params.id)

//   if (!project) {
//     return (
//       <div className="container py-10">
//         <h1 className="text-3xl font-bold tracking-tight mb-4">Project Not Found</h1>
//         <p>The project you're trying to edit doesn't exist or has been removed.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="container py-10 max-w-3xl">
//       <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Project</h1>
//       <ProjectForm project={project} isEditing={true} />
//     </div>
//   )
// }

import { ProjectForm } from "@/components/project-form"

// Example using mock API fetch function
async function fetchProject(id: string) {
  const response = await fetch(`/api/projects/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch project data")
  }
  return response.json()
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  let project = null

  try {
    project = await fetchProject(params.id)
  } catch (error) {
    console.error(error)
  }

  if (!project) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Project Not Found</h1>
        <p>The project you're trying to edit doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Project</h1>
      <ProjectForm project={project} isEditing={true} />
    </div>
  )
}
// import { ProjectForm } from "@/components/project-form"
