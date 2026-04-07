import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

export default function Search({ className }: { className?: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const [request, setRequest] = useState<string>("");

  const handleSearch = () => {
    if (request.trim()) {
      setOpen(false);
      window.location.href = `/search?query=${encodeURIComponent(request)}`;
    }
  };

  return (
    <>
      <Button
        aria-label="Открыть поиск"
        variant="icon"
        className={className}
        onClick={() => setOpen(true)}
      >
        <IconSearch size={22} />
      </Button>

      <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Введите запрос</DialogTitle>
          </DialogHeader>
          <div className="relative flex">
            <Input
              placeholder="Поиск..."
              value={request}
              onChange={(e) => setRequest(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button
              className="absolute right-0"
              variant="icon"
              onClick={handleSearch}
            >
              <IconSearch />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
