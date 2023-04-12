


import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerModifier()
class modifier_sven_great_cleave_lua extends BaseModifier{
    great_cleave_damage:number
    great_cleave_radius:number

    IsHidden(): boolean {
        return true
    }

    OnCreated(params: object): void {
        print("modifier_sven_great_cleave_lua OnCreated")
        this.great_cleave_damage = this.GetAbility().GetSpecialValueFor("great_cleave_damage")
        this.great_cleave_radius = this.GetAbility().GetSpecialValueFor("great_cleave_radius")
    }

    OnRefresh(params: object): void {
        this.great_cleave_damage = this.GetAbility().GetSpecialValueFor("great_cleave_damage")
        this.great_cleave_radius = this.GetAbility().GetSpecialValueFor("great_cleave_radius")        
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK_LANDED]
    }

    OnAttackLanded(event: ModifierAttackEvent): void {
        //print("sven attack")
        if (IsServer()){
            if (event.attacker == this.GetParent()&&!this.GetParent().IsIllusion())
            {
                if (this.GetParent().PassivesDisabled())
                return
            }
            const target = event.target

            if (target&&target.GetTeamNumber()!=this.GetParent().GetTeamNumber())
            {
                //local cleaveDamage = ( self.great_cleave_damage * params.damage ) / 100.0
				//DoCleaveAttack( self:GetParent(), target, self:GetAbility(), cleaveDamage, self.great_cleave_radius, "particles/units/heroes/hero_sven/sven_spell_great_cleave.vpcf" )

                /*
                declare function DoCleaveAttack(
                    attacker: CDOTA_BaseNPC,
                    target: CDOTA_BaseNPC,
                    ability: CDOTABaseAbility | undefined,
                    damage: number,
                    startRadius: number,
                    endRadius: number,
                    distance: number,
                    effectName: string,
                ): number;
                */

                const cleaveDamage = (this.great_cleave_damage*event.damage)/100
                const damage:Number = DoCleaveAttack(this.GetParent(), target, this.GetAbility(), cleaveDamage,0, this.great_cleave_radius, this.great_cleave_radius,"particles/units/heroes/hero_sven/sven_spell_great_cleave.vpcf")

                print("cleave damage is ", damage)
            }
        }
    }
}