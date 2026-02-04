import { PersonaLanding } from "@/pages/personas/PersonaLanding";
import { personaLandingConfigs } from "@/pages/personas/personaLandingConfig";

export default function LandingFounders() {
  return <PersonaLanding config={personaLandingConfigs.founders} />;
}