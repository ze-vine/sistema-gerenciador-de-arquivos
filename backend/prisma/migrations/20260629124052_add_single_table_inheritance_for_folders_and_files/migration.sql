-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('FOLDER', 'FILE');

-- CreateTable
CREATE TABLE "components" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "file_type" TEXT,
    "file_size" INTEGER,
    "public_id" TEXT,
    "component_type" "ComponentType" NOT NULL,
    "parent_type" "ComponentType",
    "parent_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "components_id_user_id_component_type_key" ON "components"("id", "user_id", "component_type");

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_parent_id_user_id_parent_type_fkey" FOREIGN KEY ("parent_id", "user_id", "parent_type") REFERENCES "components"("id", "user_id", "component_type") ON DELETE CASCADE ON UPDATE CASCADE;
