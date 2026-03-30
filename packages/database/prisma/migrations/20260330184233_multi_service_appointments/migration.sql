/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `totalDuration` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_serviceId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "serviceId",
ADD COLUMN     "totalDuration" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "AppointmentService" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "durationMin" INTEGER NOT NULL,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentService_appointmentId_idx" ON "AppointmentService"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentService_appointmentId_serviceId_key" ON "AppointmentService"("appointmentId", "serviceId");

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
