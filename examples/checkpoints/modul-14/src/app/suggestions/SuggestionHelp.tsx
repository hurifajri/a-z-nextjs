"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function SuggestionHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Panduan usulan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usulan Buku Toko Belajar</DialogTitle>
          <DialogDescription>
            Isi judul buku dan alasan untuk dipertimbangkan pengelola toko.
            Usulan tersimpan di toko dan tidak mengubah katalog Open Library.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
