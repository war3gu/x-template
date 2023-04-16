

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

    GetStatusEffectName(): string {                                           //这是需要触发的modifier，需要特效表现
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
        return "modifier_sven_gods_strength_child_lua"          //而且加到自己身上需要转圈，加到别人身上不需要。所以要分成2个modifier
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.FRIENDLY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.HERO
    }

    GetAuraSearchFlags(): UnitTargetFlags {          //某些UnitTargetFlags字段，对于这个接口是无效的.UnitTargetFlags可以用于很多地方
        return UnitTargetFlags.NONE
    }

    GetAuraRadius(): number {
        return this.scepter_aoe
    }

    
    GetAuraEntityReject(entity: CDOTA_BaseNPC): boolean {     //对于这种纯查询的逻辑，可以不用判断IsServer
        if(this.GetParent() == entity)
        {
            return true
        }
        else{
            return false
        }
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