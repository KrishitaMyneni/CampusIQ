-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "collegeId" INTEGER;

-- CreateIndex
CREATE INDEX "Question_collegeId_idx" ON "Question"("collegeId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
