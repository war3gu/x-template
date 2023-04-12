

import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerModifier()
class modifier_sven_gods_strength_lua extends BaseModifier{

    gods_strength_damage:number
    gods_strength_damage_scepter:number
    scepter_aoe:number

    IsPurgable(): boolean {
        return false
    }

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_gods_strength.vpcf"
    }

    StatusEffectPriority(): ModifierPriority {
        return ModifierPriority.ULTRA
    }

    GetHeroEffectName(): string {
        return "particles/units/heroes/hero_sven/sven_gods_strength_hero_effect.vpcf"
    }

    HeroEffectPriority(): ModifierPriority {
        return ModifierPriority.ULTRA
    }

    IsAura(): boolean {
        if(IsServer())
        {
            return this.GetCaster().HasScepter()
        }
        else
        {
            return false
        }
    }

    GetModifierAura(): string {
        return "modifier_sven_gods_strength_child_lua"
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.FRIENDLY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.HERO
    }

    GetAuraSearchFlags(): UnitTargetFlags {
        return UnitTargetFlags.INVULNERABLE
    }

    GetAuraRadius(): number {
        return this.scepter_aoe
    }

    GetAuraEntityReject(entity: CDOTA_BaseNPC): boolean {
        if(IsServer())
        {
            if(this.GetParent() == entity)
            {
                return true
            }
        }

        return false
    }

    OnCreated(params: object): void {
        this.gods_strength_damage = this.GetAbility().GetSpecialValueFor("gods_strength_damage")

        this.gods_strength_damage_scepter = this.GetAbility().GetSpecialValueFor("gods_strength_damage_scepter")

        this.scepter_aoe = this.GetAbility().GetSpecialValueFor("scepter_aoe")
        
        if(IsServer())
        {
            const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_sven/sven_spell_gods_strength_ambient.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent())
            
            ParticleManager.SetParticleControlEnt(nFXIndex, 0, this.GetParent(), ParticleAttachment.POINT_FOLLOW,"attach_weapon",this.GetParent().GetOrigin(),true)

            ParticleManager.SetParticleControlEnt(nFXIndex, 2, this.GetParent(), ParticleAttachment.POINT_FOLLOW,"attach_head",this.GetParent().GetOrigin(),true)

            this.AddParticle(nFXIndex,false,false,-1,false,true)
        }
    }

    OnRefresh(params: object): void {
        this.gods_strength_damage = this.GetAbility().GetSpecialValueFor("gods_strength_damage")

        this.gods_strength_damage_scepter = this.GetAbility().GetSpecialValueFor("gods_strength_damage_scepter")

        this.scepter_aoe = this.GetAbility().GetSpecialValueFor("scepter_aoe")
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.BASEDAMAGEOUTGOING_PERCENTAGE]
    }

    GetModifierBaseDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
        return this.gods_strength_damage
    }










}