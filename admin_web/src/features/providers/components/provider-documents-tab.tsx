'use client';

/**
 * Falcon Rider Admin Portal — Provider Documents Tab
 */

import { FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils/format';
import type { ProviderDocument } from '../types/provider.types';

export function ProviderDocumentsTab({ documents }: { documents: ProviderDocument[] }) {
  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents"
        description="This provider has not submitted any documents yet."
      />
    );
  }

  return (
    <div className="grid gap-3">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium">
                  {doc.type.replace(/_/g, ' ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  Uploaded {formatDate(doc.createdAt)}
                  {doc.expiresAt && ` · Expires ${formatDate(doc.expiresAt)}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadgeAuto status={doc.status} />
              <Button variant="outline" size="sm" asChild>
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}