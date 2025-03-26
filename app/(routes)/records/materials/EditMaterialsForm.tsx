"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditMaterial, { Material } from "./EditMaterial";

interface EditMaterialDialogProps {
  material: Material;
  onMaterialUpdated: (updatedMaterial: Material) => void;
}

export default function EditMaterialDialog({
  material,
  onMaterialUpdated,
}: EditMaterialDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
          <SquarePen />
          Edit Cost
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Material Cost</DialogTitle>
          <DialogDescription>
            Update the cost for{" "}
            <span className="font-semibold">{material.name}</span>
          </DialogDescription>
        </DialogHeader>
        <EditMaterial
          material={material}
          onMaterialUpdated={(updatedMaterial) => {
            onMaterialUpdated(updatedMaterial);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
