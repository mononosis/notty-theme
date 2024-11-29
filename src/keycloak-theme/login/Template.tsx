import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, TrendingUp, Bitcoin } from 'lucide-react'


const Logo = () => (
  <div className="relative w-24 h-24">
    <svg
      className="w-full h-full"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Crypto notification logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4500" />
          <stop offset="50%" stopColor="#8B0000" />
          <stop offset="100%" stopColor="#00008B" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" stroke="#FFA500" strokeWidth="4" />
      <path
        d="M25 50C25 36.2 36.2 25 50 25C63.8 25 75 36.2 75 50V65H25V50Z"
        fill="white"
      />
      <circle cx="50" cy="70" r="5" fill="white" />
      <Bitcoin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-yellow-500" />
    </svg>
  </div>
)

const SocialSentiment = ({ sentiment }: { sentiment: number }) => (
  <div className="flex items-center space-x-2">
    <TrendingUp className={`w-5 h-5 ${sentiment > 0 ? 'text-green-500' : 'text-red-500'}`} />
    <span className={`text-sm font-medium ${sentiment > 0 ? 'text-green-500' : 'text-red-500'}`}>
      {sentiment > 0 ? '+' : ''}{sentiment}%
    </span>
  </div>
)

const BackgroundGrid = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-blue-900 z-0">
    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
  </div>
)

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    kcContext,
    //doUseDefaultCss,
    //classes,
    i18n,
    children
  } = props;

  // Fallback functions if i18n is undefined
  const { msg, msgStr, enabledLanguages } = i18n;
  const { auth, url, message, isAppInitiatedAction } = kcContext || {};

  useEffect(() => {
    document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
  }, []);
  return (
    <div className=" relative min-h-screen flex items-center justify-center p-4">
      <BackgroundGrid />

      <Card className="w-full max-w-lg bg-black/50 text-gray-100 backdrop-blur-sm z-10 border-orange-500/30">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          <div className="flex w-full justify-between items-center">
            <SocialSentiment sentiment={2.5} />
            {enabledLanguages && enabledLanguages.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-100">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Select language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {enabledLanguages.map(({ languageTag, label, href }, i) => (
                    <DropdownMenuItem
                      key={languageTag}
                      role="none"
                    >
                      <a
                        role="menuitem"
                        id={`language-${i + 1}`}
                        href={href}
                      >
                        {label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <Logo />
        </CardHeader>
        <CardContent>
          <header className="mb-4">
            {(() => {
              const node = !(auth?.showUsername && !auth?.showResetCredentials) ? (
                <h2 className="text-2xl font-bold text-center mb-6 text-orange-400">{headerNode}</h2>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">{auth.attemptedUsername}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={url?.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                      {msg("restartLoginTooltip")}
                    </a>
                  </Button>
                </div>
              );

              if (displayRequiredFields) {
                return (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      <span className="text-red-500">*</span>
                      {msg("requiredFields")}
                    </span>
                    {node}
                  </div>
                );
              }

              return node;
            })()}
          </header>

          {displayMessage && message && (message.type !== "warning" || !isAppInitiatedAction) && (
            <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
              {message.type === "success" && <CheckCircle2 className="h-4 w-4" />}
              {message.type === "warning" && <AlertCircle className="h-4 w-4" />}
              {message.type === "error" && <AlertCircle className="h-4 w-4" />}
              {message.type === "info" && <Info className="h-4 w-4" />}
              <AlertTitle className="capitalize">{message.type}</AlertTitle>
              <AlertDescription dangerouslySetInnerHTML={{
                __html: kcSanitize(message.summary)
              }} />
            </Alert>
          )}

          {children}

          {auth?.showTryAnotherWayLink && (
            <form action={url?.loginAction} method="post" className="mt-4">
              <input type="hidden" name="tryAnotherWay" value="on" />
              <Button
                variant="link"
                className="p-0"
                type="submit"
              >
                {msg("doTryAnotherWay")}
              </Button>
            </form>
          )}

          {socialProvidersNode}

          {displayInfo && (
            <div className="mt-4">
              {infoNode}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


