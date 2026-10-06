"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";

export default function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Dialog title" description="Native dialog: focus is trapped, Escape closes it, and focus returns to this button.">
        <Button type="button" onClick={() => setOpen(false)}>
          Done
        </Button>
      </Dialog>
    </>
  );
}
