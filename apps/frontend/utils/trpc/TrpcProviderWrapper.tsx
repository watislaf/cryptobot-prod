'use client';
import React, { useState } from 'react';
import { TrpcProvider } from 'apps/frontend/utils/trpc/TrpcProvider';

// this is a workaround. dont aks me why it works
export function TrpcProviderWrapper({
  children,
  backendUrl,
}: {
  backendUrl: string;
  children: React.ReactNode;
}) {
  return <TrpcProvider backendUrl={backendUrl}>{children}</TrpcProvider>;
}
