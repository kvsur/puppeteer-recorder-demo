import * as three from 'three';
import { Scene } from 'three';

declare type BodyPartParams = {
    part: 'outfit' | 'outfitTop' | 'outfitBottom' | 'footwear' | 'headwear' | 'facewear' | 'hair' | 'glasses';
    url: string | string[];
};
declare type HumanInfo = {
    position?: [number, number, number];
    rotation?: [number, number, number] | number;
    scale?: [number, number, number] | number;
    canRotate?: boolean;
    hRotRange?: [number, number];
};
declare type CameraInfo = {
    fov?: number;
    target?: [number, number, number];
    rotation?: [number, number, number];
    hRotRange?: [number, number];
    vRotRange?: [number, number];
    distance?: number;
    disRange?: [number, number];
    canPan?: boolean;
    canRotate?: boolean;
    canZoom?: boolean;
};
declare type SpotLight = {
    type: 'Spot';
    name: string;
    color: [number, number, number];
    intensity: number;
    angle: number;
    position: [number, number, number];
    rotation: [number, number, number];
};
declare type SpotLightChange = SpotLight & {
    change: (params: Partial<Omit<SpotLight, 'name' | 'type'>>) => void;
    remove: () => void;
};
declare type DirectionalLight = {
    type: 'Directional';
    name: string;
    color: [number, number, number];
    intensity: number;
    position: [number, number, number];
    rotation: [number, number, number];
};
declare type DirectionalLightChange = DirectionalLight & {
    change: (params: Partial<Omit<DirectionalLight, 'name' | 'type'>>) => void;
    remove: () => void;
};
declare type PointLight = {
    type: 'Point';
    name: string;
    color: [number, number, number];
    intensity: number;
    position: [number, number, number];
};
declare type PointLightChange = PointLight & {
    change: (params: Partial<Omit<PointLight, 'name' | 'type'>>) => void;
    remove: () => void;
};
declare type LightParams = SpotLight | DirectionalLight | PointLight;
declare type LightChange = SpotLightChange | DirectionalLightChange | PointLightChange;
declare type AnimationData = {
    actionTimeLines: {
        action?: string;
        actionFileName?: string;
        code?: string;
        duration: number;
        endTime: number;
        id?: number | null;
        originDuration?: number | null;
        resId: number;
        resUrl: string;
        startTime: number;
        thumbnailUrl?: string;
        timeRatio: number;
        videoUrl?: string | null;
    }[];
    emotionInfo: {
        ebCoeffs: number[][];
        ebName: string[];
        error?: number;
        errorInfo?: string;
        fps: number;
        frameCount: number;
        modelId?: number;
        reqCode?: string;
    };
    finish: boolean;
    source?: any;
};
declare type StreamPlay = (onStart?: (data: any) => void, onFinished?: (isFinished: boolean) => void) => void;
declare type NormalPlay = (onStart?: (data: any) => void, onFinished?: () => void) => void;
declare type NormalsPlay = (index: number, onStart?: (data: any) => void, onFinished?: () => void) => void;
declare type Stop = () => void;
declare type NormalsStop = (stopAll: boolean) => void;
declare type AnimHandlers = {
    play: NormalPlay | NormalsPlay | StreamPlay | null;
    stop: Stop | NormalsStop | null;
};
declare type TransitionParams = {
    info: {
        human?: {
            position?: [number, number, number];
            rotation?: [number, number, number] | number;
            scale?: [number, number, number] | number;
        };
        camera?: {
            target?: [number, number, number];
            rotation?: [number, number, number];
            distance?: number;
        };
    };
    onStart?: () => void;
    onFinished?: () => void;
    duration?: number;
    direction?: 'forward' | 'backward';
};
declare type EnvTextures = 'warmIndoor' | 'coldIndoor';
declare type EnvironmentParams = {
    envTexture?: EnvTextures;
    exposure?: number;
    ambientColor?: [number, number, number];
    ambientIntensity?: number;
    hightLightColor?: [number, number, number];
    hightLightIntensity?: number;
    hightLightOffset?: [number, number];
};

declare class VtuberThree {
    #private;
    constructor(canvas: HTMLCanvasElement);
    /**
     * 创建默认虚拟人
     * @param {string} url 角色模型地址
     * @param {string} gender 角色性别
     * @param {string} idleAnim 角色默认（待机）动画名称
     * @returns Promise<void>
     */
    createHuman(url: string, gender?: string, idleAnimUrl?: string): Promise<void>;
    /**
     * 设置人物及控制信息
     * @param {HumanInfo} params 人物控制参数
     * @returns void
     */
    setHumanInfo: (params: HumanInfo) => void;
    /**
     * 获取人物信息
     * @returns HumanInfo | null
     */
    getHumanInfo: () => {
        position: [number, number, number];
        rotation: [number, number, number];
        scale: [number, number, number];
        canRotate: boolean;
        hRotRange: [number, number];
    } | null;
    /**
     * 设置相机及控制参数
     * @param {CameraInfo} params 相机控制参数
     * @returns void
     */
    setCameraInfo: (params: CameraInfo) => void;
    /**
     * 获取摄像机信息
     * @returns CameraInfo
     */
    getCameraInfo: () => {
        fov: number;
        target: [number, number, number];
        rotation: [number, number, number];
        distance: number;
        hRotRange: [number, number];
        vRotRange: [number, number];
        disRange: [number, number];
        canPan: boolean;
        canRotate: boolean;
        canZoom: boolean;
    } | null;
    /**
     * 添加各类灯光
     * @param {lightParams} params 灯光参数
     * @returns void
     */
    addLight(params: LightParams): void;
    /**
     * 获取灯光参数
     * @param {string} name 灯光名称，不指定时返回所有灯光
     * @returns LightChange[]
     */
    getLight(name?: string): LightChange[];
    /**
     * 添加动画数据驱动信息
     * @param {AnimationData | AnimationData[]} data 动画驱动数据
     * @param {boolean} isStream 是否是流式的
     * @returns void
     */
    addAnimation(data: AnimationData | AnimationData[], isStream?: boolean): Promise<AnimHandlers>;
    /**
     * 人物、摄像机位置过渡
     * @param {TransitionParams} params 过渡参数
     * @returns void
     */
    transition(params: TransitionParams): void;
    /**
     * 设置渲染环境参数
     * @param {EnvironmentParams} params
     * @returns Promise<void>
     */
    setEnviroment(params: EnvironmentParams): Promise<void>;
    /**
     * 获取默认渲染环境参数
     * @returns DefEnvParams
     */
    get defaultEnvParams(): {
        [key: string]: Required<EnvironmentParams>;
    };
    /**
     * 获取场景，用以特殊情况下的场景调整，不对外暴漏
     */
    getScene(): Scene | null;
    /** 换装相关，后续实现 */
    setBodyParts(...params: BodyPartParams[]): Promise<void>;
    /** 换装相关，后续实现 */
    setBodyMaskTexture(url: string): Promise<unknown>;
    quit(): void;
}

interface Func {
    (data: any): void;
}
interface ColorConfig {
    head: {
        brow: string;
        hair: string;
        beard: string;
        eyemakeup: string;
        lip: string;
    };
    skin: string;
}
interface SliderData {
    value: number;
    name: string;
}
interface MorphParams {
    dimension: string;
    lowParam: SliderData;
    highParam: SliderData;
}
interface MorphPartData {
    face?: MorphParams[];
    eyes?: MorphParams[];
    nose?: MorphParams[];
    mouth?: MorphParams[];
    ears?: MorphParams[];
    hair?: MorphParams[];
    eyeballs?: MorphParams[];
    teeth?: MorphParams[];
    eyebrow?: MorphParams[];
}
interface AvatarConfig {
    geometry: {
        head: {
            base: string;
            face: string;
            eyes: string;
            nose: string;
            mouth: string;
            ears: string;
            hair: string;
            eyeballs: string;
            teeth: string;
        };
        clothings: {
            glasses: string;
            mask: string;
            hat: string;
            outfit: string;
        };
        body: string;
    };
    texture: {
        head: {
            base: string;
            brow: string;
            lip: string;
            beard: string;
            eyemakeup: string;
        };
        body: string;
    };
    color: ColorConfig;
    faceMakeup?: MorphPartData;
}
interface FigureConfig {
    gender: 'male' | 'female';
    model: string;
}
interface Config {
    canvas: HTMLCanvasElement;
    wsBaseUrl?: string;
    errorCallback?: Func;
}
interface PhotoConfig {
    reqCode: string;
    gender: string;
    imgFile: string;
}
interface LightConfig {
    name: string;
    type: 'Spot' | 'Directional' | 'Point';
    color: string;
    intensity: number;
    position: string;
    rotation: string;
}
interface VtuberListItem {
    id: number;
    name?: string;
    photoThumb?: string;
    roleId?: string;
}
interface VtuberId {
    vtuberId: string;
}
interface UserToken {
    userId: string;
    token: string;
}
interface Active {
    thumbnailUrl: string;
    videoUrl: string;
    resUrl: string;
    action: string;
    id: number;
    duration: number;
    timeRatio?: number;
    originDuration?: number;
    tagResourceId?: number;
}
interface ActionTimeLineConfig {
    action: string;
    code: string;
    duration: number;
    id: number;
    origin_duration: number;
    start_time: number;
    tag_resource_id: number;
    thumbnail_url: string;
    time_ratio: number;
    video_url: string;
}
interface CharConfig {
    endTime: number;
    startTime: number;
    txt: string;
}
interface BSConfig {
    ebName: string;
    frameCount: number;
    fps: number;
    ebCoeffs: [][];
    error: number;
    errorInfo: string;
}
interface MessageConfigs {
    action_time_line: ActionTimeLineConfig[];
    voice_data: string;
    bsData: BSConfig;
    voice_time_line: {
        char_time: CharConfig[];
    };
    text: string;
    text_annotaion: string;
}
interface ActionTimeLine {
    action: string;
    actionFileName: string;
    code: string;
    duration: number;
    endTime: number;
    id: number | null;
    originDuration: number | null;
    resId: number;
    resUrl: string;
    startTime: number;
    thumbnailUrl: string;
    timeRatio: number;
    videoUrl: string | null;
}
interface LastArrangeData {
    text: string;
    textAnnotation: string;
    videoPath?: string;
    duration: number;
    voiceTimeLine: any;
    actionTimeLine?: ActionTimeLine[];
}
interface PlayerConfig {
    config: {
        text: string;
        textAnnotation: string;
        duration: number;
        actionTimeLine: ActionTimeLine[];
        voiceTimeLine: {
            reqCode: string;
            modelID: number;
            ebName: string[];
            frameCount: number;
            fps: number;
            ebCoeffs: any[];
            error: number;
            errorInfo: '';
        };
    };
    voiceSettings: {
        engine: string;
        id: number;
        name: string;
        speed: number;
        tone: number;
        voiceStyle: string;
        volume: number;
    };
    vtuber_id: string;
    voiceData: {
        charTime: CharConfig[];
        pyTime: CharConfig[];
        stop: boolean;
        voiceData: string;
    };
}
interface Log {
    type: string;
    name: string;
    desc?: string;
    amount: number;
    tags?: {};
}
interface AskParam {
    question: string;
    source: string;
    sessionCode: string;
    sys?: string;
    companyId?: number;
    operator?: string;
}
interface WSHook {
    play: (clientPlay?: boolean, onStart?: ((data: any) => void) | undefined, onFinished?: () => void) => void;
    stop: Stop | NormalsStop | null;
}
interface SubmitParams {
    text: string;
    audioModelName: string;
    userId: string;
    speed?: number;
    volume?: number;
    pitch?: number;
    modelId?: string;
    fps?: number;
    style?: number;
    gender?: string;
    animojiStyle?: string;
}
interface SubmitResult {
    taskId: string;
    pollInterval: number;
    pollMaxTimeout: number;
}
interface CustomVoiceConfig {
    engine?: string;
    volume?: number;
    tone?: number;
    speed?: number;
}
interface BackgroundConfig {
    name: string;
    type: string;
    src: string;
    resolutionRatio: [];
    bgType: string;
}
interface Vector2 {
    x: number;
    y: number;
}
interface Size {
    width: number;
    height: number;
}
interface BaseImageConfig {
    isInit: boolean;
    name: string;
    position: Vector2;
    scale: Size;
    src: string;
    style: string;
    tagResId: number;
}
interface SubTitlesConfig {
    bold: boolean;
    color: string;
    fontFamily: string;
    fontSize: number;
    isShow: boolean;
    position: Vector2;
    shadow: number;
    tilt: boolean;
}
interface VoiceConfig {
    engine: string;
    icon: string;
    id: number;
    name: string;
    speed: number;
    tone: number;
    voiceStyle: string;
    volume: number;
}
interface VtuberConfig {
    animojiStyle: string;
    background: BackgroundConfig;
    baseImage: BaseImageConfig;
    gender: number;
    knowledgeBase: {
        source: string;
    };
    serviceType: number;
    style: number;
    subtitles: SubTitlesConfig;
    voice: VoiceConfig;
    vtuberId: number;
    vtuberStyle: number;
    vtuberTransform: string;
}
interface BroadcastResult {
    voiceData: {
        voiceTime: {
            text: string;
            startTime: string;
            endTime: string;
            splitTime: string;
        }[];
        voiceData: string;
    };
    emotionData: {
        ebName: string;
        frameCount: number;
        fps: number;
        ebCoeffs: [][];
    };
    actionData: {
        startTime: number;
        endTime: number;
        timeRatio: number;
        duration: number;
        thumbnailUrl: string;
        resId: number;
        resUrl: string;
        actionFileName: string;
    }[];
}

declare enum _BodyPart {
    body = "Body",
    teeth = "Teeth",
    head = "Head",
    eyeball = "Eyeball",
    hair = "Hair",
    outfit_top = "Outfit_Top",
    outfit_bottom = "Outfit_Bottom",
    outfit = "Outfit",
    glasses = "Glasses",
    headwear = "Headwear",
    facewear = "Facewear",
    outfit_footwear = "Outfit_Footwear",
    body_texture = "BodyTexture",
    head_texture = "HeadTexture",
    eyemakeup_texture = "EyemakeupTexture",
    lip_texture = "LipTexture",
    beardTextture = "BeardTexture",
    face_shape = "FaceShape",
    eye_shape = "EyeShape",
    nose_shape = "NoseShape",
    mouth_shape = "MouthShape",
    ears_shape = "EarsShape"
}
declare enum _ClothParts {
    outfit_top = "Outfit_Top",
    outfit_bottom = "Outfit_Bottom",
    outfit = "Outfit",
    glasses = "Glasses",
    headwear = "Headwear",
    facewear = "Facewear",
    outfit_footwear = "Outfit_Footwear"
}
declare enum _AvatarClothParts {
    'clothing' = "clothing",
    'glasses' = "glasses",
    'hat' = "hat",
    'mask' = "mask"
}
declare const _BabylonPart2Unity: {
    clothing: string;
    glasses: string;
    hat: string;
    mask: string;
};
declare enum _ColorPart {
    skin = "SkinColor",
    eyemakeup_color = "EyemakeupColor",
    lip_color = "LipColor",
    eye_brow_color = "EyeBrowColor",
    hair_color = "HairColor",
    background_color = "BackgroundColor",
    capture_background_color = "CaptureBackgroundColor"
}
declare const _Genders: {
    male: 'man';
    female: 'woman';
};
declare const noseList: {
    name2: string;
    dimension: string;
    name1: string;
}[];
declare const faceList: {
    name2: string;
    dimension: string;
    name1: string;
}[];
declare const mouthList: {
    name1: string;
    dimension: string;
    name2: string;
}[];
declare const eyebrowList: {
    name2: string;
    dimension: string;
    name1: string;
}[];
declare const eyesList: {
    name1: string;
    dimension: string;
    name2: string;
}[];
declare const getMorphDefaultData: (feature?: 'nose' | 'face' | 'mouth' | 'eyes' | 'eyebrow' | 'all') => {
    nose: any;
    face: any;
    mouth: any;
    eyebrow: any;
    eyes: any;
    hair: any;
    ears: any;
    eyeballs: any;
    teeth: any;
} | {
    nose: {
        lowParam: {
            name: any;
            value: number;
        };
        dimension: any;
        highParam: {
            name: any;
            value: number;
        };
    }[];
    mouth?: undefined;
    face?: undefined;
    eyebrow?: undefined;
    eyes?: undefined;
} | {
    mouth: {
        lowParam: {
            name: any;
            value: number;
        };
        dimension: any;
        highParam: {
            name: any;
            value: number;
        };
    }[];
    nose?: undefined;
    face?: undefined;
    eyebrow?: undefined;
    eyes?: undefined;
} | {
    face: {
        lowParam: {
            name: any;
            value: number;
        };
        dimension: any;
        highParam: {
            name: any;
            value: number;
        };
    }[];
    nose?: undefined;
    mouth?: undefined;
    eyebrow?: undefined;
    eyes?: undefined;
} | {
    eyebrow: {
        lowParam: {
            name: any;
            value: number;
        };
        dimension: any;
        highParam: {
            name: any;
            value: number;
        };
    }[];
    nose?: undefined;
    mouth?: undefined;
    face?: undefined;
    eyes?: undefined;
} | {
    eyes: {
        lowParam: {
            name: any;
            value: number;
        };
        dimension: any;
        highParam: {
            name: any;
            value: number;
        };
    }[];
    nose?: undefined;
    mouth?: undefined;
    face?: undefined;
    eyebrow?: undefined;
};
declare const _CameraType: {
    nvBanShen: string;
    nanBanShen: string;
    quanshen: string;
};

/**
 * 字幕
 */
declare class Caption {
    private _dom;
    private _startXY;
    private _tmpXY;
    private _isDragging;
    constructor(_canvas: HTMLCanvasElement);
    private initCaptionStyle;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    private initCaptionDragable;
    /**
     * 给字幕添加样式
     * @param className 类名
     */
    addClass(className: string): void;
    /**
     * 设置字幕位置
     * @param position 相对位置的top和left
     */
    changePosition(position: {
        top: number;
        left: number;
    }): void;
    /**
     * 设置文案
     * @params text 文案
     */
    setText(text: string): void;
    /**
     * 设置字幕的显隐状态
     * @param show 显示还是隐藏
     */
    changeCaptionStatus(show: boolean): void;
    /**
     * 设置字幕是否可移动
     * @param movable 是否可移动
     */
    changeMoveStatus(movable: boolean): void;
    get caption(): HTMLElement;
    destroy: () => void;
}

declare class Ability {
    private _engineInstance?;
    private _config;
    private _caption;
    private _pcmPlayer;
    private _textArr;
    private _animationFrame;
    private _controller;
    private _volume;
    private _ws;
    private _end_time;
    private _taskQueue;
    private _voiceConfig?;
    private _wsUpdate?;
    private _vtuberConfig?;
    private _sendUuid?;
    private _uuid;
    private _surplusText;
    private _isAnimoji;
    private _wsCallbacks?;
    private wsHandle?;
    private _polling?;
    constructor(config: Config);
    private stateChange;
    private onEnded;
    private createAudioPlayer;
    initThreeEngine: () => void;
    /**
     * 获取字幕的实例
     */
    get caption(): Caption | undefined;
    /**
     * 获取画布的实例
     */
    get canvasInstance(): VtuberThree | undefined;
    /**
     * 获取卡通人列表
     * @returns 3D 卡通人列表
     */
    getVtuberList: () => Promise<VtuberListItem[]>;
    /**
     * 查询虚拟人人设详情
     * @param id 卡通人id
     * @returns 卡通人详情
     */
    queryByvtuberId: (id: VtuberId) => Promise<any>;
    private addLogForWs;
    private deleteGetText;
    private createWs;
    /**
     * 通过id创建虚拟人
     * @param id 虚拟人形象id
     */
    createVtuberById: (id: number, useWS?: boolean) => Promise<void | undefined>;
    /**
     * 发送之前清空标志位，包含任务队列，队列结束标识以及音频
     */
    private resetStart;
    /**
     * 问答接口
     * @param question
     * @param cb 回调，处理答案
     * @param isWS 是否是流式播放，默认为true
     * @param source 指定知识库
     */
    sendQuestion: (question: string, cb?: (str: string) => string, isWS?: boolean, source?: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * 打断ws
     */
    resetWS: () => void;
    /**
     * 关闭ws
     */
    closeWS: () => void;
    /***
     * ws 的回调方法
     * @params fn (param: WSHook) => void
     */
    addWSCallback(fn: (param: WSHook) => void): void;
    sendWSText: (text: string, voiceConfig?: {
        engine?: string | undefined;
        volume?: number | undefined;
        tone?: number | undefined;
        speed?: number | undefined;
    } | undefined) => void;
    private sendWSTextServe;
    private getBsByInfo;
    /**
     * 初始化字幕样式
     * @params 字幕样式
     */
    private setCaptionStyle;
    /**
     * 获取当前id最后一次的动作编排和声音编排的数据
     * @params id 形象id
     * @params errorCallback 错误的回调
     * @params successedCallback 成功的回调
     */
    getLastAssemDataById: (id: string) => Promise<void>;
    /***
     *  自动生成动作
     * @params _text 文本
     * @params _voiceConfig 声音配置
     * @params _type 动作类型
     * @params gender 性别
     * @params style 虛擬人風格
     * @params animojiStyle 風格標簽
     */
    private aiActive;
    /**
     * 设置音量
     * @param val 音量 number
     */
    setVolume: (val: number) => void;
    /**
     * 获取当前音量
     */
    get playerVolume(): number;
    private voiceToNumber;
    private text2Voice;
    /**
     *
     * @params _text 文本
     * @params style 風格標簽
     */
    sendMessage: (_text: string, voiceConfig?: {
        engine?: string | undefined;
        volume?: number | undefined;
        tone?: number | undefined;
        speed?: number | undefined;
    } | undefined) => Promise<{
        play: (clientPlay?: boolean, onStart?: ((data: any) => void) | undefined, onFinished?: (() => void) | undefined) => void;
        stop: () => void;
    }>;
    private submitText;
    /**
     *
     * @params _text 文本数组
     * @params style 風格標簽
     */
    sendMessages: (_text: string[], userId: string, voiceConfig?: CustomVoiceConfig | undefined) => Promise<{
        play: (index: number, clientPlay?: boolean, onStart?: ((data: any) => void) | undefined, onFinished?: (() => void) | undefined) => void;
        stop: (stopAll?: boolean) => void;
        datas: {
            source: {
                actionTimeLines: {
                    startTime: number;
                    endTime: number;
                    timeRatio: number;
                    duration: number;
                    thumbnailUrl: string;
                    resId: number;
                    resUrl: string;
                    actionFileName: string;
                }[];
                emotionInfo: {
                    ebName: any;
                    frameCount: number;
                    fps: number;
                    ebCoeffs: [][];
                };
                voiceData: string;
                voiceTime: {
                    text: string;
                    startTime: string;
                    endTime: string;
                    splitTime: string;
                }[];
                finish: boolean;
            };
            actionTimeLines: {
                startTime: number;
                endTime: number;
                timeRatio: number;
                duration: number;
                thumbnailUrl: string;
                resId: number;
                resUrl: string;
                actionFileName: string;
            }[];
            emotionInfo: {
                ebName: any;
                frameCount: number;
                fps: number;
                ebCoeffs: [][];
            };
            voiceData: string;
            voiceTime: {
                text: string;
                startTime: string;
                endTime: string;
                splitTime: string;
            }[];
            finish: boolean;
        }[];
    }>;
    /**
     * 更新字幕
     */
    private updateCaption;
    /**
     * 重置音频数据
     */
    private resetVoiceData;
    /**
     * 初始化创建人物模型
     * @params bodyData model url
     * @params gender 性别
     * @params active 待机动画
     * @return 通过OnInitOverCallback 初始化渲染结束的回调
     */
    createHumanBody: (bodyData: string, gender?: string | undefined, active?: string | undefined) => Promise<void>;
    /**
     *  人物旋转
     * @param {HumanInfo} data 包含 position、 rotation、 scale
     * @return void
     */
    changeHumanInfo(data: HumanInfo): void;
    /**
     * 获取人物信息
     * @returns HumanInfo
     */
    getHumanInfo(): void | {
        position: [number, number, number];
        rotation: [number, number, number];
        scale: [number, number, number];
        canRotate: boolean;
        hRotRange: [number, number];
    } | null;
    /**
     * 添加光源
     * @param {lightParams} data 灯光参数
     * @return void
     */
    addLight(data: LightParams): void;
    /**
     * 设置相机的控制参数
     * @param {CameraInfo} params 相机位置、旋转、缩放参数
     * @returns void
     */
    changeCameraInfo(info: CameraInfo): void;
    /**
     * 获取摄像机信息
     * @returns CameraInfo
     */
    getCameraInfo(): void | {
        fov: number;
        target: [number, number, number];
        rotation: [number, number, number];
        distance: number;
        hRotRange: [number, number];
        vRotRange: [number, number];
        disRange: [number, number];
        canPan: boolean;
        canRotate: boolean;
        canZoom: boolean;
    } | null;
    /**
     * 移动人物或者相机时的插值动画
     * @param {TransitionParams} params 人物或相机的信息，以及开始结束回调，旋转方向，过渡时间
     */
    transition(params: TransitionParams): void;
    /**
     * 获取灯光参数
     * @param {string} name 灯光名称，不指定时返回所有灯光
     * @returns LightChange[]
     */
    getLight(name?: string): void | LightChange[];
    /**
     * 设置渲染环境参数
     * @param {EnvironmentParams} params
     * @returns Promise<void>
     */
    setEnviroment(params: EnvironmentParams): Promise<void>;
    /**
     * 获取默认渲染环境参数
     * @returns DefEnvParams | errorMessage
     */
    getDefaultEnvParams(): void | {
        [key: string]: Required<EnvironmentParams>;
    };
    /**
     * 获取场景，用以特殊情况下的场景调整，不对外暴漏
     */
    getScene(): three.Scene | null | undefined;
    quit: () => Promise<void>;
}

declare class InitSDK {
    private _SDKInstance?;
    private _app_secret;
    private _app_id;
    private _config;
    constructor(app_secret: string, app_id: string, http_base_url: string, ws_base_url?: string);
    initEngine: (config: Config) => Promise<void | Ability>;
    private resetToken;
    get instance(): Ability | undefined;
}

export { Ability, ActionTimeLine, ActionTimeLineConfig, Active, AskParam, AvatarConfig, BSConfig, BackgroundConfig, BaseImageConfig, BroadcastResult, Caption, CharConfig, ColorConfig, Config, CustomVoiceConfig, FigureConfig, Func, InitSDK, LastArrangeData, LightConfig, Log, MessageConfigs, MorphParams, MorphPartData, PhotoConfig, PlayerConfig, Size, SliderData, SubTitlesConfig, SubmitParams, SubmitResult, UserToken, Vector2, VoiceConfig, VtuberConfig, VtuberId, VtuberListItem, WSHook, _AvatarClothParts, _BabylonPart2Unity, _BodyPart, _CameraType, _ClothParts, _ColorPart, _Genders, eyebrowList, eyesList, faceList, getMorphDefaultData, mouthList, noseList };
