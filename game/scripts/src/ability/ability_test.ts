
import { BaseAbility, registerAbility } from "../utils/dota_ts_adapter";
import { reloadable } from "../utils/tstl-utils";
import "../modifier/modifier_test";

@reloadable
@registerAbility()
class ability_test extends BaseAbility{

    id:ProjectileID

    Precache(context: CScriptPrecacheContext): void {
        PrecacheResource('particle', "particles/dev/library/base_tracking_projectile.vpcf", context)
        PrecacheResource('particle', "particles/econ/events/ti10/high_five/towers/dire_tower_2021/high_five_dire_tower_2021_impact_fire.vpcf", context)

        //particles/units/heroes/hero_lich/lich_chain_frost.vpcf
    }


    OnSpellStart(): void{
        print("开始释放技能")

        //particles/dev/library/base_linear_projectile_model.vpcf

        this.id = ProjectileManager.CreateLinearProjectile({
            "Ability":this,
            "EffectName":"particles/econ/items/tuskarr/tusk_ti5_immortal/tusk_ice_shards_projectile_stout.vpcf",
            "Source":this.GetCaster(),
            "fDistance":2000,
            "vVelocity":this.GetCaster().GetForwardVector().__mul(300),
            "vSpawnOrigin":this.GetCaster().GetOrigin(),
            "iUnitTargetFlags":UnitTargetFlags.NONE,
            "iUnitTargetTeam":UnitTargetTeam.ENEMY,
            "iUnitTargetType":UnitTargetType.ALL
        })




        /*
        const point = this.GetOrigin()

        const units = FindUnitsInRadius(DotaTeam.NOTEAM, point, null, 500, UnitTargetTeam.ENEMY, UnitTargetType.ALL, UnitTargetFlags.NONE, FindOrder.FARTHEST, false)

        units.forEach(unit => {
            print("OnSpellStart", unit.GetName())
            const project:CreateTrackingProjectileOptions = {
                "Ability":this,
                "EffectName":"particles/dev/library/base_tracking_projectile.vpcf",
                "Source":this.GetCaster(),
                "Target":unit,
                "bDodgeable":false,
                "iMoveSpeed":600
            }

            ProjectileManager.CreateTrackingProjectile(project)
        });
        */
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        this.id&&ProjectileManager.DestroyLinearProjectile(this.id)
        print("OnProjectileHit1")
        if (target){
            print("OnProjectileHit2")
            target.AddNewModifier(this.GetCaster(), this, "modifier_test", {duration:10})
        }
    }


    /*
    OnProjectileHitHandle(target: CDOTA_BaseNPC, location: Vector, projectileHandle: ProjectileID): boolean | void {
        
        const id = ParticleManager.CreateParticle("particles/econ/events/ti10/high_five/towers/dire_tower_2021/high_five_dire_tower_2021_impact_fire.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target)
        ParticleManager.SetParticleControl(id, 3, target.GetOrigin())
        Timers.CreateTimer(2, ()=>{
            ParticleManager.DestroyParticle(id, true)
        })

        const damageTable:ApplyDamageOptions = {
            "ability":this,
            "attacker":this.GetCaster(),
            "damage":300,
            "damage_flags":DamageFlag.NONE,
            "damage_type":DamageTypes.MAGICAL,
            "victim":target
        }

        ApplyDamage(damageTable)

        print("OnProjectileHitHandle", target.GetName())
        target.AddNewModifier(this.GetCaster(), this, "modifier_test", {duration:10} )

        //
        print("击中了目标3")
    }
    */

    OnAbilityPhaseStart(): boolean {
        print("技能开始释放，但是资源还没有消耗")
        return true
    }
}