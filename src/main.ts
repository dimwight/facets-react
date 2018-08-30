import {
  ContentingApp,
  launchApp as testAppsLaunch,
  Specs as TestSpecs,
  buildContentingLayout,
} from './react/_globals';
import {launchApp as calendarLaunch} from './calendar/_locals';
if(true)testAppsLaunch(TestSpecs.AllNonSelecting);
else if(true) new ContentingApp(buildContentingLayout).buildSurface();
else calendarLaunch();