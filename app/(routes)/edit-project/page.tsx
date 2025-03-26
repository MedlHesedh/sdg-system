// "use client";

// import { useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { supabase } from "@/utils/supabase/client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const formSchema = z.object({
//   projectId: z.string().min(1),
//   categoryId: z.string().min(1),
//   materialId: z.string().min(1),
//   unitMeasurement: z.string(),
//   mtrlQty: z.number().positive(),
//   mtrlForecastedCost: z.number().positive(),
//   mtrlTtlCost: z.number(),
//   laborId: z.string().min(1),
//   lbrQuantity: z.number().positive(),
//   lbrForecastedCost: z.number().positive(),
//   lbrTtlCost: z.number(),
//   totalCost: z.number(),
// });

// function MaterialLaborAssignment() {
//   const { user } = useUser();
//   const router = useRouter();
//   const [loader, setLoader] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       projectId: "",
//       categoryId: "",
//       materialId: "",
//       unitMeasurement: "",
//       mtrlQty: 0,
//       mtrlForecastedCost: 0,
//       mtrlTtlCost: 0,
//       laborId: "",
//       lbrQuantity: 0,
//       lbrForecastedCost: 0,
//       lbrTtlCost: 0,
//       totalCost: 0,
//     },
//   });

//   const nextHandler = async (values) => {
//     setLoader(true);
//     const { data, error } = await supabase
//       .from("assigned_resources")
//       .insert([
//         {
//           ...values,
//           createdBy: user?.primaryEmailAddress?.emailAddress,
//         },
//       ])
//       .select();

//     if (data) {
//       setLoader(false);
//       console.log("Material & Labor Assigned", data);
//       toast("Resources Assigned Successfully");
//       router.replace("/manage-resources/" + data[0].id);
//     }
//     if (error) {
//       setLoader(false);
//       console.log("Error", error);
//       toast("Server-side error");
//     }
//   };

//   return (
//     <div className="mt-10 md:mx-56 lg:mx-80">
//       <div className="p-10 flex flex-col gap-5 items-center justify-center">
//         <h2 className="font-bold text-3xl">Material & Labor Assignment</h2>
//         <div className="p-10 rounded-lg border w-full shadow-md">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(nextHandler)} className="space-y-5">
//               <FormField
//                 control={form.control}
//                 name="projectId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Project ID</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter Project ID" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="categoryId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Material Category</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Category" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Masonry">Masonry</SelectItem>
//                         <SelectItem value="Electrical">Electrical</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button type="submit" disabled={loader}>
//                 {loader ? "Assigning..." : "Assign Resources"}
//               </Button>
//             </form>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MaterialLaborAssignment;
