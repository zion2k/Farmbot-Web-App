import { Everything } from "../../interfaces";
import * as moment from "moment";
import { FarmEventProps } from "../interfaces";
import { joinFarmEventsToExecutable } from "./calendar/selectors";
import { Calendar } from "./calendar/index";
import { occurrence } from "./calendar/occurrence";
import { findSequenceById } from "../../resources/selectors";
import { ResourceIndex } from "../../resources/interfaces";
import { FarmEventWithRegimen, FarmEventWithSequence } from "./calendar/interfaces";

/** Prepares a FarmEvent[] for use with <FBSelect /> */
export function mapStateToProps(state: Everything): FarmEventProps {
  let x = joinFarmEventsToExecutable(state.resources.index);
  let push = (state && state.router && state.router.push) || (() => { });
  let calendar = mapResourcesToCalendar(state.resources.index, moment.now());
  let calendarRows = calendar.getAll();
  return { calendarRows, push };
}

/** TODO: Reduce complexity, but write *good* unit tests *before* refactoring.*/
export function mapResourcesToCalendar(ri: ResourceIndex, unixNow = moment.now()): Calendar {
  let x = joinFarmEventsToExecutable(ri);
  let calendar = new Calendar();
  let addRegimenToCalendar = regimenCalendarAdder(ri);

  x.map(function (fe) {
    switch (fe.executable_type) {
      case "Regimen": return addRegimenToCalendar(fe, calendar);
      case "Sequence": return addSequenceToCalendar(fe, calendar);
      default: throw new Error(`Bad fe: ${JSON.stringify(fe)}`);
    }
  });

  return calendar;
}
export let regimenCalendarAdder = (index: ResourceIndex) =>
  (f: FarmEventWithRegimen, c: Calendar) => {
    let { regimen_items } = f.executable;
    let fromEpoch = (ms: number) => moment(f.start_time)
      .startOf("day")
      .add(ms, "ms");
    let now = moment();
    regimen_items.map(ri => {
      let time = fromEpoch(ri.time_offset);
      if (time.isAfter(now)) {
        let o = occurrence(time, f);
        let seq = findSequenceById(index, ri.sequence_id);
        o.parentExecutableName = f.executable.name;
        o.childExecutableName = seq.body.name;
        c.insert(o);
      }
    });
  };

export let addSequenceToCalendar = (f: FarmEventWithSequence, c: Calendar) => {
  (f.calendar || [])
    .map(date => moment(date))
    .map(m => c.insert(occurrence(m, f)));
};
