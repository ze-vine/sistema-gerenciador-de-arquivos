-- CreateIndex
CREATE INDEX "components_user_id_parent_id_idx" ON "components"("user_id", "parent_id" DESC);
