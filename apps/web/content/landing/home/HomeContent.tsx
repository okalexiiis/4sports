/* COMPONENTS */

import { Farewell } from './components/farewell/Farewell'
import { Features } from './components/features/Features'
import { Hero } from './components/hero/Hero'
import { Teams } from './components/teams/Teams'
import { Tournaments } from './components/tournaments/Tournaments'
import { WhoWeAre } from './components/whoWeAre/WhoWeAre'
import { WhoYouAre } from './components/whoYouAre/WhoYouAre'

export function HomeContent() {
  return (
    <div>
      <Hero />
      <WhoWeAre />
      <Features />
      <WhoYouAre />
      <Tournaments />
      <Teams />
      <Farewell />
    </div>
  )
}
