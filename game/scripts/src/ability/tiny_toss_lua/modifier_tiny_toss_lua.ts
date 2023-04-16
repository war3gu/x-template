

import { BaseModifierMotionBoth } from "../../utils/dota_ts_adapter";
import { registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";
import {modifier_generic_arc_lua} from "../generic/modifier_generic_arc_lua"
import "../generic/modifier_generic_arc_lua"

@reloadable
@registerModifier()
class modifier_tiny_toss_lua extends BaseModifierMotionBoth{
    
    damage:number
    radius:number
    target:CDOTA_BaseNPC

    distance:number
    duration:number
    speed:number
    accel:number
    max_speed:number

    constructor(){
        print("modifier_tiny_toss_lua constructor")
        super()
    }

    IsHidden(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return this.GetCaster().GetTeamNumber()!=this.GetParent().GetTeamNumber()
    }

    IsStunDebuff(): boolean {
        return true
    }

    IsPurgable(): boolean {
        return true
    }

    OnCreated(paramsOld: object): void {
        
        print("modifier_tiny_toss_lua OnCreated")
        let params = paramsOld as {[key: string]: any}
        this.damage = this.GetAbility().GetSpecialValueFor("toss_damage")
        this.radius = this.GetAbility().GetSpecialValueFor("radius")
        if(!IsServer()){
            return
        }

        this.target = EntIndexToHScript(params.target) as CDOTA_BaseNPC
        print("this.target :" + this.target)
        let duration = this.GetAbility().GetSpecialValueFor("duration")
        let height = 850


        
        let arc = this.GetParent().AddNewModifier(
            this.GetCaster(),
            this.GetAbility(),
            "modifier_generic_arc_lua",
            {
                duration: duration,
                distance: 0,
                height: height,
                fix_duration: false,
                isStun: true,
                activity: GameActivity.DOTA_FLAIL,
            }
            ) as modifier_generic_arc_lua;

        //print("arc :" + arc)

        
        arc.SetEndCallback((interrupted: boolean) => {
            // destroy this modifier
            this.Destroy();
            
            // not damage if interrupted
            if (interrupted) return;
            
            // find units
            const enemies = FindUnitsInRadius(
                this.GetCaster().GetTeamNumber(), // int, your team number
                this.GetParent().GetOrigin(), // point, center point
                undefined, // handle, cacheUnit. (not known)
                this.radius, // float, radius. or use FIND_UNITS_EVERYWHERE
                UnitTargetTeam.ENEMY, // int, team filter
                UnitTargetType.HERO + UnitTargetType.BASIC, // int, type filter
                UnitTargetFlags.NONE, // int, flag filter
                FindOrder.ANY, // int, order filter
                false // bool, can grow cache
            );
            
            // precache damage
            const damageTable: ApplyDamageOptions = {
                attacker: this.GetCaster(),
                damage: this.damage,
                damage_type: this.GetAbility().GetAbilityDamageType(),
                ability: this.GetAbility(), // Optional.
                victim: null
            };
            
            // damage
            for (const enemy of enemies) {
                // damage
                damageTable.victim = enemy;
                if (enemy === this.GetParent()) {
                    damageTable.damage = 2 * this.damage;
                } else {
                    damageTable.damage = this.damage;
                }
                ApplyDamage(damageTable);
            }
            
            // destroy trees
            GridNav.DestroyTreesAroundPoint(this.GetParent().GetOrigin(), this.radius, false);
            
            // play effects
            const sound_cast = "Ability.TossImpact";
            EmitSoundOn(sound_cast, this.GetParent());
        });
        

        let origin = this.target.GetOrigin()
        let direction = origin.__sub(this.GetParent().GetOrigin())
        let distance = direction.Length2D()
        direction.z = 0
        direction = direction.Normalized()

        this.distance = distance
        if(this.distance == 0){
            this.distance = 1
        }
        this.duration = duration
        this.speed = distance/duration
        this.accel = 100
        this.max_speed = 3000

        if(!this.ApplyHorizontalMotionController()){
            this.Destroy()
        }

        let sound_cast = "Ability.TossThrow"
        let sound_target = "Hero_Tiny.Toss.Target"

        EmitSoundOn(sound_cast, this.GetCaster())
        EmitSoundOn(sound_target, this.GetParent())

    }

    OnRefresh(params: object): void {
        this.damage = this.GetAbility().GetSpecialValueFor("toss_damage")
        this.radius = this.GetAbility().GetSpecialValueFor("radius")        
    }

    OnRemoved(): void {
        
    }

    OnDestroy(): void {
        if(!IsServer()){
            return
        }

        this.GetParent().RemoveHorizontalMotionController(this)
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.STUNNED]:true
        }
    }

    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        let target = this.target.GetOrigin()
        let parent = this.GetParent().GetOrigin()

        let duration = this.GetElapsedTime()
        let direction = target.__sub(parent)
        let distance = direction.Length2D()
        direction.z = 0
        direction = direction.Normalized()

        //let original_distance = duration/this.duration*this.distance
        let expected_speed = 0
        if(this.GetElapsedTime()>=this.duration){
            expected_speed = this.speed
        }
        else{
            expected_speed = distance/(this.duration-this.GetElapsedTime())
        }

        if(this.speed<expected_speed){
            this.speed = Math.min(this.speed+this.accel, this.max_speed)
        }
        else{
            this.speed = Math.max(this.speed - this.accel, 0)
        }

        let pos = parent.__add(direction.__mul(this.speed*dt))
        me.SetOrigin(pos)
    }

    OnHorizontalMotionInterrupted(): void {
        this.Destroy()
    }

    GetEffectName(): string {
        return "particles/units/heroes/hero_tiny/tiny_toss_blur.vpcf"
    }

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW
    }

}