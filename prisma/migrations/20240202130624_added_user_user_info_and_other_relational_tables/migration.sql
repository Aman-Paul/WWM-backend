/*
  Warnings:

  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[unique_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleId` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `unique_id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "role",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "roleId" INTEGER NOT NULL,
ADD COLUMN     "unique_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "user_info" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "unique_id" TEXT NOT NULL,
    "refundable_percentage" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER NOT NULL DEFAULT 1,
    "intro_link" TEXT,
    "specialization_id" INTEGER,
    "lable_id" INTEGER,

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "unique_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specializations" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "unique_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labels" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "unique_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_info_unique_id_key" ON "user_info"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_unique_id_key" ON "roles"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_unique_id_key" ON "specializations"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "labels_unique_id_key" ON "labels"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_id_key" ON "users"("unique_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_lable_id_fkey" FOREIGN KEY ("lable_id") REFERENCES "labels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
