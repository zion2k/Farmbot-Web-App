import * as React from "react";
import { connect } from "react-redux";
import { t } from "i18next";
import { BackArrow } from "../../ui";
import { TaggedPlantPointer } from "../../resources/tagged_resources";
import { mapStateToProps, formatPlantInfo } from "./map_state_to_props"
import { PlantInfoBase } from "./plant_info_base";
import { PlantPanel } from "./plant_panel";


@connect(mapStateToProps)
export class EditPlantInfo extends PlantInfoBase {
  default = (plant_info: TaggedPlantPointer) => {
    let info = formatPlantInfo(plant_info);
    return <div className="panel-container green-panel" >
      <div className="panel-header green-panel">
        <p className="panel-title">
          <BackArrow />
          <span className="title">
            {t("Edit")} {info.name}
          </span>
        </p>
      </div>
      <PlantPanel info={info} onDestroy={this.destroy} />
    </div>;
  }

  render() {
    let plant_info = this.plant;
    return plant_info ? this.default(plant_info) : this.fallback();
  }
}
