-- CreateTable
CREATE TABLE "SavedComparison" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "college1Id" INTEGER NOT NULL,
    "college2Id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedComparison_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedComparison_userId_college1Id_college2Id_key" ON "SavedComparison"("userId", "college1Id", "college2Id");

-- AddForeignKey
ALTER TABLE "SavedComparison" ADD CONSTRAINT "SavedComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
