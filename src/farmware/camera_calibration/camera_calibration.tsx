import * as React from "react";
import { t } from "i18next";
import { Widget, Row, Col, WidgetBody } from "../../ui/index";
import { CameraCalibrationState, CameraCalibrationProps } from "./interfaces";
import { TitleBar } from "../weed_detector/title";
import { ImageWorkspace } from "../weed_detector/image_workspace";
import { ToolTips } from "../../constants";
import { envSave } from "../weed_detector/remote_env/actions";
import { WDENVKey } from "../weed_detector/remote_env/interfaces";
import { devices } from "../../device";
import { selectImage } from "../images/actions";
import { calibrate, scanImage } from "./actions";

export class CameraCalibration extends
  React.Component<CameraCalibrationProps, CameraCalibrationState> {
  render() {
    return (
      <Widget className="weed-detector-widget coming-soon">
        <TitleBar
          title={"Camera Calibration"}
          help={t(ToolTips.CAMERA_CALIBRATION)}
          onCalibrate={this.props.dispatch(calibrate)}
          env={this.props.env}
        />
        <WidgetBody>
          <Row>
            <Col sm={12}>
              <ImageWorkspace
                onProcessPhoto={(id) => { this.props.dispatch(scanImage(id)); }}
                onFlip={(uuid) => this.props.dispatch(selectImage(uuid))}
                images={this.props.images}
                currentImage={this.props.currentImage}
                onChange={(key, value) => {
                  let MAPPING: Record<typeof key, WDENVKey> = {
                    "iteration": "CAMERA_CALIBRATION_iteration",
                    "morph": "CAMERA_CALIBRATION_morph",
                    "blur": "CAMERA_CALIBRATION_blur",
                    "H_HI": "CAMERA_CALIBRATION_H_HI",
                    "H_LO": "CAMERA_CALIBRATION_H_LO",
                    "S_HI": "CAMERA_CALIBRATION_S_HI",
                    "S_LO": "CAMERA_CALIBRATION_S_LO",
                    "V_HI": "CAMERA_CALIBRATION_V_HI",
                    "V_LO": "CAMERA_CALIBRATION_V_LO"
                  };
                  envSave(MAPPING[key], value);
                }}
                iteration={this.props.iteration}
                morph={this.props.morph}
                blur={this.props.blur}
                H_LO={this.props.H_LO}
                S_LO={this.props.S_LO}
                V_LO={this.props.V_LO}
                H_HI={this.props.H_HI}
                S_HI={this.props.S_HI}
                V_HI={this.props.V_HI}
              />
            </Col>
          </Row>
        </WidgetBody>
      </Widget>
    );
  }
}
