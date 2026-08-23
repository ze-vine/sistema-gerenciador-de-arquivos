-- DropForeignKey
ALTER TABLE "components" DROP CONSTRAINT "components_parent_id_user_id_parent_type_fkey";

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_parent_id_user_id_component_type_fkey" FOREIGN KEY ("parent_id", "user_id", "component_type") REFERENCES "components"("id", "user_id", "component_type") ON DELETE RESTRICT ON UPDATE CASCADE;
