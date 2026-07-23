import { Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <main className="flex flex-col gap-4 bg-canvas p-4 md:p-8">
      <Card className="gap-0 overflow-hidden border-0 bg-transparent p-0">
        <div className="bg-primary px-5 py-4 text-on-primary">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="caption-tight text-on-dark-mute">CFG</p>
              <h1 className="heading-md text-on-primary">Paramètres</h1>
            </div>
            <Badge variant="secondary" className="w-fit">
              Module
            </Badge>
          </div>
        </div>

        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md bg-surface-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center text-primary">
                <Settings />
              </div>
              <span className="rounded-sm border border-hairline px-2 py-1 code-sm text-ash">
                CFG
              </span>
            </div>
            <div className="mt-4">
              <h2 className="body-md font-medium text-ink">
                Cette fonctionnalité arrive bientôt
              </h2>
              <p className="mt-1 min-h-10 body-sm text-charcoal">
                Notre équipe finalise actuellement son développement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SettingsPage;
