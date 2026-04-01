-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "modelName" TEXT,
    "key" TEXT NOT NULL,
    "currentUsage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usageLimit" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);
