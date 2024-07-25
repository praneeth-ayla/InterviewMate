/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Convo" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "meetingRoomId" INTEGER NOT NULL,

    CONSTRAINT "Convo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingRoom" (
    "id" SERIAL NOT NULL,
    "meetingId" TEXT NOT NULL,

    CONSTRAINT "MeetingRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MeetingRoom_meetingId_key" ON "MeetingRoom"("meetingId");

-- AddForeignKey
ALTER TABLE "Convo" ADD CONSTRAINT "Convo_meetingRoomId_fkey" FOREIGN KEY ("meetingRoomId") REFERENCES "MeetingRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
