import { PersonaLanding } from "@/pages/personas/PersonaLanding";
import { personaLandingConfigs } from "@/pages/personas/personaLandingConfig";

export default function Landing() {
  return <PersonaLanding config={personaLandingConfigs.startup} />;
}