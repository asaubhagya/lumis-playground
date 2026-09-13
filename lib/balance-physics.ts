import RAPIER from '@dimforge/rapier2d-compat';
let initialization: Promise<void> | undefined;
export async function createBalance(mass: number, distance: number) {
  await (initialization ??= RAPIER.init());
  const world = new RAPIER.World({ x: 0, y: -9.81 });
  world.timestep = 1 / 60;
  const pivot = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const beam = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setAngularDamping(2));
  // Symmetric beam; ideal point loads act at each marked distance from the hinge.
  world.createCollider(RAPIER.ColliderDesc.cuboid(4.6, .035).setMass(.1), beam);
  world.createCollider(RAPIER.ColliderDesc.ball(.05).setTranslation(-2, 0).setMass(3), beam);
  world.createCollider(RAPIER.ColliderDesc.ball(.05).setTranslation(distance, 0).setMass(mass), beam);
  const joint = world.createImpulseJoint(RAPIER.JointData.revolute({ x: 0, y: 0 }, { x: 0, y: 0 }), pivot, beam, true) as RAPIER.RevoluteImpulseJoint;
  joint.setLimits(-.24, .24);
  return {
    step() { world.step(); return -beam.rotation() * 180 / Math.PI; },
    free() { world.free(); },
  };
}
