import { Options, ChangeContext } from '@angular-slider/ngx-slider';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as posenet from '@tensorflow-models/posenet';

@Component({
  selector: 'app-training-session-details',
  templateUrl: './training-session-details.component.html',
  styleUrls: ['./training-session-details.component.scss'],
})
export class TrainingSessionDetailsComponent implements OnInit {
  public architectureArray: Array<object> = [
    { name: 'MobileNet V1', value: 'MobileNetV1' },
    { name: 'ResNet 50', value: 'ResNet50' },
  ];
  public architecture: any = 'MobileNetV1';
  public multiplierArray: Array<number> = [1.01, 1.0, 0.75, 0.5];
  public multiplier: any = 0.75;
  public outputStrideArc1Array: Array<number> = [8, 16];
  public outputStrideArc2Array: Array<number> = [16, 32];
  public outputStride: any = 16;
  public inputResolutionArc1Array: Array<number> = [
    161,
    193,
    257,
    289,
    321,
    353,
    385,
    417,
    449,
    481,
    513,
  ];
  public inputResolutionArc2Array: Array<number> = [257, 513];
  public inputResolution: any = 257;
  public quantBytesArray: Array<number> = [1, 2, 4];
  public quantBytes: any = 1;
  public poseArray: Array<object> = [
    { name: 'Single Person', value: 'single-person' },
    { name: 'Multi Person', value: 'multi-person' },
  ];
  public pose = 'single-person';
  public singlePose: any;
  public multiplePose: any;
  public flipHorizontal: any = false;
  public drawKeypoints: any = false;
  public drawSkeleton: any = false;
  public drawBoundingBox: any = false;
  public scoreThresholdOptions: Options = {
    floor: 0.0,
    ceil: 1,
    step: 0.1,
    showSelectionBar: true,
  };
  public scoreThreshold: any = 0.5;
  public nmsRadiusOptions: Options = {
    floor: 1,
    ceil: 50,
    step: 1,
    showSelectionBar: true,
  };
  public nmsRadius: any = 20;
  public model: any;
  public modelLoaded = false;
  public modelText = 'Select Model';
  public imgBtnStatus = true;
  public webBtnStatus = false;
  public imageElement: any;
  @ViewChild('videoElement', { static: false }) videoElement: ElementRef;
  public video: any;
  public videoWidth = 710;
  public videoHeight = 510;
  public videoStream: any;
  public canvas: any;
  public canvasWidth = 800;
  public canvasHeight = 600;
  public canvasContext: any;
  @ViewChild('videoCanvas', { static: false }) videoCanvas: ElementRef;
  public maxPoseDetections: any = 5;
  public animationFrame: any;
  public videoPic: any = false;
  public videoCanvasEnable = false;

  constructor(private router: Router) {}
  public async ngOnInit() {
    this.model = await posenet.load();
    this.modelLoaded = true;
    setTimeout(() => {
      this.setSliderConfig();
    }, 1000);
    this.videoMode();
  }

  public videoMode() {
    cancelAnimationFrame(this.animationFrame);
    this.videoCanvasEnable = false;
    this.webBtnStatus = true;
    this.imgBtnStatus = false;
    this.video = this.videoElement.nativeElement;
    this.initCamera({ video: true, audio: false });
    this.canvas = document.getElementById('canvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasContext.clearRect(0, 0, 400, 300);
  }

  public initCamera(config: any) {
    const browser = <any>navigator;
    browser.getUserMedia =
      browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia;
    browser.mediaDevices.getUserMedia(config).then((stream: any) => {
      if (!stream.stop && stream.getTracks) {
        stream.stop = function () {
          this.getTracks().forEach(function (track: any) {
            track.stop();
          });
        };
      }
      this.videoStream = stream;
      try {
        this.video.srcObject = this.videoStream;
      } catch (err) {
        this.video.src = window.URL.createObjectURL(this.videoStream);
      }
      this.video.play();
    });
  }

  public stopVideo() {
    // this.videoStream.stop();
    this.videoStream.getTracks().forEach((track) => track.stop());
    this.video.src = '';
    this.router.navigate(['../training-sessions']);
  }

  public setSliderConfig() {
    this.scoreThresholdOptions = {
      floor: 0.0,
      ceil: 1,
      step: 0.1,
      showSelectionBar: true,
    };
    this.scoreThreshold = this.scoreThreshold;
    this.nmsRadiusOptions = {
      floor: 1,
      ceil: 50,
      step: 1,
      showSelectionBar: true,
    };
    this.nmsRadius = this.nmsRadius;
  }

  public async realTimeVideo() {
    this.videoPic = false;
    if (this.videoCanvasEnable) {
      if (this.pose === 'single-person') {
        this.singlePose = await this.model.estimatePoses(this.video, {
          flipHorizontal: this.flipHorizontal,
          decodingMethod: 'single-person',
        });
        this.renderSinglePoseResult();
      }
      this.animationFrame = requestAnimationFrame(() => {
        this.realTimeVideo();
      });
    }
  }

  public async loadModel() {
    this.canvas = document.getElementById('canvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasContext.clearRect(0, 0, 400, 300);
    const outputStride: any = parseInt(this.outputStride, 10);
    const inputResolution: any = parseInt(this.inputResolution, 10);
    const multiplier: any = parseFloat(this.multiplier);
    const quantBytes: any = parseInt(this.quantBytes, 10);
    if (this.modelText === 'MobileNet V1') {
      this.modelLoaded = false;
      this.model = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: outputStride,
        inputResolution: inputResolution,
        multiplier: multiplier,
      });
      this.modelLoaded = true;
      setTimeout(() => {
        this.setSliderConfig();
        if (this.pose === 'single-person') {
          this.estimatePose();
        } else {
          // this.estimatePoses();
        }
      }, 1000);
    } else if (this.modelText === 'ResNet 50') {
      this.modelLoaded = false;
      this.model = await posenet.load({
        architecture: 'ResNet50',
        outputStride: outputStride,
        inputResolution: inputResolution,
        quantBytes: quantBytes,
      });
      this.modelLoaded = true;
      setTimeout(() => {
        this.setSliderConfig();
        if (this.pose === 'single-person') {
          this.estimatePose();
        } else {
          // this.estimatePoses();
        }
      }, 1000);
    }
  }

  public onKeysChange(key) {
    this[key] = !this[key];
    this.realTimeVideo();
  }

  public increaseMaxPoseDetections() {
    if (this.imgBtnStatus) {
      if (this.pose === 'multi-person') {
        this.maxPoseDetections++;
        // this.estimatePoses();
      }
    } else {
      if (!this.videoPic) {
        this.realTimeVideo();
      }
    }
  }

  public decreaseMaxPoseDetections() {
    if (this.imgBtnStatus) {
      if (this.pose === 'multi-person') {
        this.maxPoseDetections--;
        // this.estimatePoses();
      }
    } else {
      if (!this.videoPic) {
        this.realTimeVideo();
      }
    }
  }

  public onScoreThresholdChanged(changeContext: ChangeContext) {
    if (this.imgBtnStatus) {
      if (this.pose === 'multi-person') {
        this.scoreThreshold = changeContext['value'];
        // this.estimatePoses();
      }
    } else {
      if (!this.videoPic) {
        this.realTimeVideo();
      }
    }
  }

  public onNmsRadiusChanged(changeContext: ChangeContext) {
    if (this.imgBtnStatus) {
      if (this.pose === 'multi-person') {
        this.nmsRadius = changeContext['value'];
        // this.estimatePoses();
      }
    } else {
      if (!this.videoPic) {
        this.realTimeVideo();
      }
    }
  }

  public estimate() {
    if (this.pose === 'single-person') {
      this.estimatePose();
    } else {
      // this.estimatePoses();
    }
  }

  public async estimatePose() {
    this.imageElement = await document.getElementById('image');
    this.singlePose = await this.model.estimatePoses(this.imageElement, {
      flipHorizontal: this.flipHorizontal,
      decodingMethod: 'single-person',
    });
    this.canvas = document.getElementById('canvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasContext.clearRect(0, 0, 400, 300);
    this.canvasContext.drawImage(this.imageElement, 0, 0, 400, 300);
    this.drawSinglePoseResult();
  }

  public async drawSinglePoseResult() {
    if (this.drawKeypoints) {
      this.singlePose[0]['keypoints'].forEach((points: any) => {
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = 'aqua';
        this.canvasContext.arc(
          points['position']['x'],
          points['position']['y'],
          3,
          0,
          Math.PI * 2,
          true
        );
        this.canvasContext.closePath();
        this.canvasContext.fill();
      });
    }
    if (this.drawSkeleton) {
      const adjacentKeyPoints = await posenet.getAdjacentKeyPoints(
        this.singlePose[0]['keypoints'],
        0.5
      );
      for (let i = 0; i < adjacentKeyPoints.length; i++) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(
          adjacentKeyPoints[i][0]['position']['x'],
          adjacentKeyPoints[i][0]['position']['y']
        );
        this.canvasContext.lineTo(
          adjacentKeyPoints[i][1]['position']['x'],
          adjacentKeyPoints[i][1]['position']['y']
        );
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = 'aqua';
        this.canvasContext.stroke();
      }
    }
    if (this.drawBoundingBox) {
      const boundingBox = posenet.getBoundingBox(
        this.singlePose[0]['keypoints']
      );
      this.canvasContext.beginPath();
      this.canvasContext.strokeStyle = 'red';
      this.canvasContext.rect(
        boundingBox.minX,
        boundingBox.minY,
        boundingBox.maxX - boundingBox.minX,
        boundingBox.maxY - boundingBox.minY
      );
      this.canvasContext.stroke();
    }
  }

  public async renderSinglePoseResult() {
    try {
      this.canvas = document.getElementById('videoCanvas');
      this.canvasContext = this.canvas.getContext('2d');
      this.canvasContext.drawImage(
        this.videoElement.nativeElement,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
      this.drawSinglePoseResult();
    } catch (e) {}
  }
}
