

import { BaseModifierMotionBoth } from "../../utils/dota_ts_adapter";
import { registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerModifier()
export class modifier_generic_arc_lua extends BaseModifierMotionBoth{

    interrupted:boolean
    end_offset:number
    endCallback:(interrupted: boolean) => void
    isForward:boolean
    isStun:boolean
    isRestricted:boolean
    duration:number
    direction:Vector
    speed:number
    const1:number
    const2:number
    distance:number
    height:number
    parent:CDOTA_BaseNPC
    activity:number
    fix_end:boolean
    fix_duration:boolean
    fix_height:boolean
    start_offset:number

    constructor(){
        print("modifier_generic_arc_lua constructor")
        super()
    }

    IsHidden(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return false
    }

    IsStunDebuff(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return true
    }

    GetAttributes(): ModifierAttribute {
       return ModifierAttribute.MULTIPLE 
    }

    OnCreated(params: object): void {
        if(!IsServer()){
            return
        }
        this.interrupted = false
        this.SetJumpParameters(params as {[key: string]: any})
        this.Jump()
    }

    OnRefresh(params: object): void {
        this.OnCreated(params)
    }

    OnRemoved(): void {
        
    }

    OnDestroy(): void {
        if(!IsServer()){
            return
        }

        let pos = this.GetParent().GetOrigin()

        this.GetParent().RemoveHorizontalMotionController(this)
        this.GetParent().RemoveVerticalMotionController(this)

        if(this.end_offset!=0){
            this.GetParent().SetOrigin(pos)
        }

        if(this.endCallback){
            this.endCallback(this.interrupted)
        }
    }

    DeclareFunctions(): ModifierFunction[] {
        let funcs = [ModifierFunction.DISABLE_TURNING]

        if(this.GetStackCount()>0){
            funcs.push(ModifierFunction.OVERRIDE_ANIMATION)
        }
        return funcs
    }

    GetModifierDisableTurning(): 0 | 1 {
        if(!this.isForward){
            return 0
        }
        else{
            return 1
        }
    }

    GetOverrideAnimation(): GameActivity {
        //let count = this.GetStackCount()
        //return count as GameActivity

        return GameActivity.DOTA_FLAIL
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        let state ={
            [ModifierState.STUNNED]:this.isStun||false,
            [ModifierState.COMMAND_RESTRICTED]:this.isRestricted||false,
            [ModifierState.NO_UNIT_COLLISION]:true
        }

        return state
    }

    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if(this.fix_duration&&this.GetElapsedTime()>=this.duration){
            return
        }

        let pos = me.GetOrigin().__add(this.direction.__mul(this.speed*dt))

        me.SetOrigin(pos)
    }

    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (this.fix_duration && this.GetElapsedTime() >= this.duration) return;

        const pos = me.GetOrigin();
        const time = this.GetElapsedTime();
    
        // set relative position
        const height = pos.z;
        const speed = this.GetVerticalSpeed(time);
        pos.z = height + speed * dt;
        me.SetOrigin(pos);
    
        if (!this.fix_duration) {
            const ground = GetGroundHeight(pos, me) + this.end_offset;
            if (pos.z <= ground) {
                // below ground, set height as ground then destroy
                pos.z = ground;
                me.SetOrigin(pos);
                this.Destroy();
            }
        }      
    }

    OnHorizontalMotionInterrupted(): void {
        this.interrupted = true
        this.Destroy()
    }

    OnVerticalMotionInterrupted(): void {
        this.interrupted = true
        this.Destroy()
    }

    SetJumpParameters(kv: {[key: string]: any}){
        print("SetJumpParameters")
        this.parent = this.GetParent()
             
        this.fix_end = true
        this.fix_duration = true
        this.fix_height = true
        if (kv.fix_end) {
            this.fix_end = kv.fix_end
        }
        if (kv.fix_duration) {
            this.fix_duration = kv.fix_duration
        }
        if (kv.fix_height) {
            this.fix_height = kv.fix_height
        }


        this.isStun = kv.isStun
        this.isRestricted = kv.isRestricted
        this.isForward = kv.isForward
        this.activity = kv.activity || 0
        this.SetStackCount(this.activity)

        // load direction
        if (kv.target_x && kv.target_y) {
            const origin = this.parent.GetOrigin()
            let dir = Vector(kv.target_x, kv.target_y, 0).__sub(origin)
            dir.z = 0
            dir = dir.Normalized()
            this.direction = dir
        }

        if (kv.dir_x && kv.dir_y) {
            this.direction = Vector(kv.dir_x, kv.dir_y, 0).Normalized()
        }
        if (!this.direction) {
            this.direction = this.parent.GetForwardVector()
        }

        // load horizontal data
        this.duration = kv.duration
        this.distance = kv.distance
        this.speed = kv.speed
        if (!this.duration) {
            this.duration = this.distance / this.speed
        }
        if (!this.distance) {
            this.speed = this.speed || 0
            this.distance = this.speed * this.duration
        }
        if (!this.speed) {
            this.distance = this.distance || 0
            this.speed = this.distance / this.duration
        }

        // load vertical data
        this.height = kv.height || 0
        this.start_offset = kv.start_offset || 0
        this.end_offset = kv.end_offset || 0

        // calculate height positions
        const pos_start = this.parent.GetOrigin()
        const pos_end = pos_start.__add(this.direction.__mul(this.distance))
        const height_start = GetGroundHeight(pos_start, this.parent) + this.start_offset
        let height_end = GetGroundHeight(pos_end, this.parent) + this.end_offset
        let height_max

        // determine jumping height if not fixed
        if (!this.fix_height) {

            // ideal height is proportional to max distance
            this.height = math.min(this.height, this.distance / 4)
        }

        // determine height max
        if (this.fix_end) {
            height_end = height_start
            height_max = height_start + this.height
        } else {
            // calculate height
            let tempmin = height_start, tempmax = height_end
            if (tempmin > tempmax) {
                [tempmin, tempmax] = [tempmax, tempmin]
            }
            const delta = (tempmax - tempmin) * 2 / 3

            height_max = tempmin + delta + this.height
        }

        // set duration
        if (!this.fix_duration) {
            this.SetDuration(-1, false)
        } else {
            this.SetDuration(this.duration, true)
        }

        // calculate arc
        this.InitVerticalArc(height_start, height_max, height_end, this.duration)

    }

    Jump(){
        if (this.distance > 0) {
            if (!this.ApplyHorizontalMotionController()) {
                this.interrupted = true;
                this.Destroy();
            }
        }
        
        if (this.height > 0) {
            if (!this.ApplyVerticalMotionController()) {
                this.interrupted = true;
                this.Destroy();
            }
        }
    }

    InitVerticalArc(height_start:number, height_max:number, height_end:number, duration:number){
        height_end -= height_start;
        height_max -= height_start;
      
        // fail-safe1: height_max cannot be smaller than height delta
        if (height_max < height_end) {
          height_max = height_end + 0.01;
        }
      
        // fail-safe2: height-max must be positive
        if (height_max <= 0) {
          height_max = 0.01;
        }
      
        // math magic
        const duration_end = (1 + Math.sqrt(1 - height_end / height_max)) / 2;
        this.const1 = 4 * height_max * duration_end / duration;
        this.const2 = 4 * height_max * duration_end * duration_end / (duration * duration);
    }

    GetVerticalSpeed(time:number):number{
        return this.const1 - 2*this.const2*time
    }

    SetEndCallback(func:(interrupted: boolean) => void):void{
        this.endCallback = func
    }


}