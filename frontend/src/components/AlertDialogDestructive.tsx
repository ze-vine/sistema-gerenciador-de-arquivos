import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import type { IFile } from "@/@types/file";

interface AlertDialogDestructiveProps {
  buttonTitle: ReactNode,
  title: ReactNode,
  description: ReactNode,
  cancelTitle: ReactNode,
  actionTitle: ReactNode,
  deleteFileFunction: (id: string) => void,
  deletedFile: IFile,
  className: string
}

export function AlertDialogDestructive({ 
  buttonTitle, 
  title, 
  description, 
  cancelTitle, 
  actionTitle,
  deleteFileFunction,
  deletedFile,
  className
}: AlertDialogDestructiveProps) {
  return (
    <div className={className}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">{buttonTitle}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">{cancelTitle}</AlertDialogCancel>
            <AlertDialogAction onClick={() => { deleteFileFunction(deletedFile.id) }} variant="destructive">{actionTitle}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}