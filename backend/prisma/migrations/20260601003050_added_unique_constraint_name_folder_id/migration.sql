/*
  Warnings:

  - A unique constraint covering the columns `[name,folder_id]` on the table `folders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "folders_name_folder_id_key" ON "folders"("name", "folder_id");
