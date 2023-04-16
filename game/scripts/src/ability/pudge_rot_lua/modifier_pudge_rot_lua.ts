

import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerModifier()
class modifier_pudge_rot_lua extends BaseModifier{

    rot_radius:number
    rot_slow:number
    rot_damage:number
    rot_tick:number

    constructor(){
        print("modifier_pudge_rot_lua constructor")
        super()
    }

    IsDebuff(): boolean {
        return true
    }

    IsAura(): boolean {
        if(this.GetCaster()==this.GetParent()){
            return true
        }
        else{
            return false
        }
    }

    GetModifierAura(): string {
        return "modifier_pudge_rot_lua"
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.ENEMY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.HERO+UnitTargetType.BASIC
    }

    GetAuraRadius(): number {
        return this.rot_radius
    }

    OnCreated(params: object): void {
        this.rot_radius = this.GetAbility().GetSpecialValueFor("rot_radius");
        this.rot_slow = this.GetAbility().GetSpecialValueFor("rot_slow");
        this.rot_damage = this.GetAbility().GetSpecialValueFor("rot_damage");
        this.rot_tick = this.GetAbility().GetSpecialValueFor("rot_tick");
    
        if (IsServer()) {
            if (this.GetParent() == this.GetCaster()) {
                EmitSoundOn("Hero_Pudge.Rot", this.GetCaster());
                const nFXIndex = ParticleManager.CreateParticle("particles/units/heroes/hero_pudge/pudge_rot.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent());
                ParticleManager.SetParticleControl(nFXIndex, 1, Vector(this.rot_radius, 1, this.rot_radius));
                this.AddParticle(nFXIndex, false, false, -1, false, false);
            } else {
                const nFXIndex = ParticleManager.CreateParticle("particles/units/heroes/hero_pudge/pudge_rot_recipient.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent());
                this.AddParticle(nFXIndex, false, false, -1, false, false);
            }
    
            this.StartIntervalThink(this.rot_tick);
            this.OnIntervalThink();
        }       
    }

    OnDestroy(): void {
        if(IsServer()){
            StopSoundOn("Hero_Pudge.Rot", this.GetCaster())
        }
    }

    DeclareFunctions(): ModifierFunction[] {
        
        let funcs = [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE]

        return funcs
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        if(this.GetParent()==this.GetCaster()){
            return 0
        }
        else{
            return this.rot_slow
        }
    }

    OnIntervalThink(): void {
        if(IsServer()){
            let flDamagePerTick = this.rot_tick * this.rot_damage

            if (this.GetCaster().IsAlive()) {
                let damage: ApplyDamageOptions = {
                    victim: this.GetParent(),
                    attacker: this.GetCaster(),
                    damage: flDamagePerTick,
                    damage_type: DamageTypes.MAGICAL,
                    damage_flags: DamageFlag.NONE,
                    ability: this.GetAbility()
                };
                
                ApplyDamage(damage);
            }
        }
    }
}