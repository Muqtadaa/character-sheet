-- ============================================================================
-- SRD builtin seed (3/3): core feats (general, fighter, metamagic, item-creation).
-- `data` JSONB matches featDataSchema in src/lib/schemas/content.ts:
--   feat_type, prerequisites {bab, abilities, skills, feats, casterLevel, special},
--   benefit, and `grants` (engine bonus entries the sheet applies automatically).
-- A representative core set; the full feat list extends this via the same shape.
-- Idempotent.
-- ============================================================================

delete from feats where source = 'builtin';

insert into feats (source, name, slug, feat_type, data) values
-- Save / defense / misc bonus feats (untyped grants stack)
('builtin','Alertness','alertness','general','{"benefit":"+2 on Listen and Spot checks.","grants":[{"target":"skill:listen","type":"untyped","value":2},{"target":"skill:spot","type":"untyped","value":2}]}'),
('builtin','Improved Initiative','improved-initiative','fighter','{"benefit":"+4 on initiative checks.","grants":[{"target":"initiative","type":"untyped","value":4}]}'),
('builtin','Lightning Reflexes','lightning-reflexes','general','{"benefit":"+2 on Reflex saves.","grants":[{"target":"save:ref","type":"untyped","value":2}]}'),
('builtin','Great Fortitude','great-fortitude','general','{"benefit":"+2 on Fortitude saves.","grants":[{"target":"save:fort","type":"untyped","value":2}]}'),
('builtin','Iron Will','iron-will','general','{"benefit":"+2 on Will saves.","grants":[{"target":"save:will","type":"untyped","value":2}]}'),
('builtin','Toughness','toughness','general','{"benefit":"+3 hit points.","grants":[{"target":"hp","type":"untyped","value":3}]}'),
-- +2/+2 skill feats
('builtin','Acrobatic','acrobatic','general','{"benefit":"+2 on Jump and Tumble checks.","grants":[{"target":"skill:jump","type":"untyped","value":2},{"target":"skill:tumble","type":"untyped","value":2}]}'),
('builtin','Agile','agile','general','{"benefit":"+2 on Balance and Escape Artist checks.","grants":[{"target":"skill:balance","type":"untyped","value":2},{"target":"skill:escape-artist","type":"untyped","value":2}]}'),
('builtin','Athletic','athletic','general','{"benefit":"+2 on Climb and Swim checks.","grants":[{"target":"skill:climb","type":"untyped","value":2},{"target":"skill:swim","type":"untyped","value":2}]}'),
('builtin','Deceitful','deceitful','general','{"benefit":"+2 on Disguise and Forgery checks.","grants":[{"target":"skill:disguise","type":"untyped","value":2},{"target":"skill:forgery","type":"untyped","value":2}]}'),
('builtin','Investigator','investigator','general','{"benefit":"+2 on Gather Information and Search checks.","grants":[{"target":"skill:gather-information","type":"untyped","value":2},{"target":"skill:search","type":"untyped","value":2}]}'),
('builtin','Negotiator','negotiator','general','{"benefit":"+2 on Diplomacy and Sense Motive checks.","grants":[{"target":"skill:diplomacy","type":"untyped","value":2},{"target":"skill:sense-motive","type":"untyped","value":2}]}'),
('builtin','Nimble Fingers','nimble-fingers','general','{"benefit":"+2 on Disable Device and Open Lock checks.","grants":[{"target":"skill:disable-device","type":"untyped","value":2},{"target":"skill:open-lock","type":"untyped","value":2}]}'),
('builtin','Persuasive','persuasive','general','{"benefit":"+2 on Bluff and Intimidate checks.","grants":[{"target":"skill:bluff","type":"untyped","value":2},{"target":"skill:intimidate","type":"untyped","value":2}]}'),
('builtin','Self-Sufficient','self-sufficient','general','{"benefit":"+2 on Heal and Survival checks.","grants":[{"target":"skill:heal","type":"untyped","value":2},{"target":"skill:survival","type":"untyped","value":2}]}'),
('builtin','Stealthy','stealthy','general','{"benefit":"+2 on Hide and Move Silently checks.","grants":[{"target":"skill:hide","type":"untyped","value":2},{"target":"skill:move-silently","type":"untyped","value":2}]}'),
-- Melee / combat feats
('builtin','Dodge','dodge','fighter','{"prerequisites":{"abilities":{"dex":13}},"benefit":"+1 dodge bonus to AC against one opponent.","grants":[{"target":"ac","type":"dodge","value":1}]}'),
('builtin','Mobility','mobility','fighter','{"prerequisites":{"abilities":{"dex":13},"feats":["dodge"]},"benefit":"+4 dodge AC against attacks of opportunity from movement."}'),
('builtin','Spring Attack','spring-attack','fighter','{"prerequisites":{"abilities":{"dex":13},"feats":["dodge","mobility"],"bab":4},"benefit":"Move before and after a melee attack without provoking from the target."}'),
('builtin','Power Attack','power-attack','fighter','{"prerequisites":{"abilities":{"str":13}},"benefit":"Trade attack bonus for melee damage on a 1-for-1 basis (up to BAB)."}'),
('builtin','Cleave','cleave','fighter','{"prerequisites":{"abilities":{"str":13},"feats":["power-attack"]},"benefit":"Extra melee attack when you drop a foe."}'),
('builtin','Great Cleave','great-cleave','fighter','{"prerequisites":{"abilities":{"str":13},"feats":["power-attack","cleave"],"bab":4},"benefit":"No limit to Cleave attacks per round."}'),
('builtin','Improved Bull Rush','improved-bull-rush','fighter','{"prerequisites":{"abilities":{"str":13},"feats":["power-attack"]},"benefit":"No attack of opportunity when bull rushing; +4 on the check."}'),
('builtin','Combat Expertise','combat-expertise','fighter','{"prerequisites":{"abilities":{"int":13}},"benefit":"Trade attack bonus for dodge AC (up to 5)."}'),
('builtin','Improved Disarm','improved-disarm','fighter','{"prerequisites":{"abilities":{"int":13},"feats":["combat-expertise"]},"benefit":"No attack of opportunity when disarming; +4 on the check."}'),
('builtin','Improved Trip','improved-trip','fighter','{"prerequisites":{"abilities":{"int":13},"feats":["combat-expertise"]},"benefit":"No attack of opportunity when tripping; +4 on the check; free attack on success."}'),
('builtin','Weapon Finesse','weapon-finesse','fighter','{"prerequisites":{"bab":1},"benefit":"Use Dex instead of Str on attack rolls with light weapons."}'),
('builtin','Weapon Focus','weapon-focus','fighter','{"prerequisites":{"bab":1},"benefit":"+1 on attack rolls with the chosen weapon.","grants":[{"target":"attack","type":"untyped","value":1}]}'),
('builtin','Weapon Specialization','weapon-specialization','fighter','{"prerequisites":{"feats":["weapon-focus"],"special":"Fighter level 4th"},"benefit":"+2 on damage rolls with the chosen weapon."}'),
('builtin','Improved Critical','improved-critical','fighter','{"prerequisites":{"bab":8},"benefit":"Double the threat range of the chosen weapon."}'),
('builtin','Two-Weapon Fighting','two-weapon-fighting','fighter','{"prerequisites":{"abilities":{"dex":15}},"benefit":"Reduce two-weapon fighting penalties."}'),
('builtin','Improved Two-Weapon Fighting','improved-two-weapon-fighting','fighter','{"prerequisites":{"abilities":{"dex":17},"feats":["two-weapon-fighting"],"bab":6},"benefit":"Gain a second off-hand attack at -5."}'),
('builtin','Combat Reflexes','combat-reflexes','fighter','{"benefit":"Make additional attacks of opportunity equal to Dex bonus."}'),
('builtin','Improved Unarmed Strike','improved-unarmed-strike','fighter','{"benefit":"Unarmed strikes deal lethal damage and never provoke."}'),
('builtin','Improved Grapple','improved-grapple','fighter','{"prerequisites":{"abilities":{"dex":13},"feats":["improved-unarmed-strike"]},"benefit":"No attack of opportunity when grappling; +4 on grapple checks."}'),
('builtin','Stunning Fist','stunning-fist','fighter','{"prerequisites":{"abilities":{"dex":13,"wis":13},"feats":["improved-unarmed-strike"],"bab":8},"benefit":"Stun a foe with an unarmed strike (Fort save)."}'),
('builtin','Blind-Fight','blind-fight','fighter','{"benefit":"Reroll miss chance from concealment; better against invisible foes."}'),
-- Ranged feats
('builtin','Point Blank Shot','point-blank-shot','fighter','{"benefit":"+1 attack and damage with ranged weapons within 30 ft.","grants":[{"target":"attack:ranged","type":"untyped","value":1}]}'),
('builtin','Precise Shot','precise-shot','fighter','{"prerequisites":{"feats":["point-blank-shot"]},"benefit":"No -4 penalty for shooting into melee."}'),
('builtin','Rapid Shot','rapid-shot','fighter','{"prerequisites":{"abilities":{"dex":13},"feats":["point-blank-shot"]},"benefit":"One extra ranged attack each round at -2 to all."}'),
('builtin','Manyshot','manyshot','fighter','{"prerequisites":{"abilities":{"dex":17},"feats":["point-blank-shot","rapid-shot"],"bab":6},"benefit":"Fire multiple arrows at a single target as a standard action."}'),
('builtin','Far Shot','far-shot','fighter','{"prerequisites":{"feats":["point-blank-shot"]},"benefit":"Increase ranged weapon range increments."}'),
-- General / utility
('builtin','Endurance','endurance','general','{"benefit":"+4 on checks to resist fatigue and environmental effects."}'),
('builtin','Diehard','diehard','general','{"prerequisites":{"feats":["endurance"]},"benefit":"Remain conscious and active between -1 and -9 hit points."}'),
('builtin','Run','run','general','{"benefit":"Run at 5x speed; +4 on running Jump checks."}'),
('builtin','Track','track','general','{"benefit":"Use Survival to follow tracks."}'),
('builtin','Leadership','leadership','general','{"prerequisites":{"special":"Character level 6th"},"benefit":"Attract a cohort and followers."}'),
('builtin','Skill Focus','skill-focus','general','{"benefit":"+3 on checks with the chosen skill."}'),
('builtin','Combat Casting','combat-casting','general','{"benefit":"+4 on Concentration checks to cast defensively."}'),
('builtin','Spell Focus','spell-focus','general','{"benefit":"+1 to save DCs of spells from the chosen school."}'),
('builtin','Greater Spell Focus','greater-spell-focus','general','{"prerequisites":{"feats":["spell-focus"]},"benefit":"Additional +1 to save DCs of the chosen school."}'),
('builtin','Spell Penetration','spell-penetration','general','{"benefit":"+2 on caster level checks to beat spell resistance."}'),
-- Metamagic
('builtin','Empower Spell','empower-spell','metamagic','{"feat_type":"metamagic","benefit":"Increase variable numeric spell effects by 50% (+2 spell level)."}'),
('builtin','Extend Spell','extend-spell','metamagic','{"feat_type":"metamagic","benefit":"Double a spell duration (+1 spell level)."}'),
('builtin','Maximize Spell','maximize-spell','metamagic','{"feat_type":"metamagic","benefit":"Maximize variable numeric effects (+3 spell level)."}'),
('builtin','Quicken Spell','quicken-spell','metamagic','{"feat_type":"metamagic","benefit":"Cast as a swift action (+4 spell level)."}'),
('builtin','Silent Spell','silent-spell','metamagic','{"feat_type":"metamagic","benefit":"Cast without verbal components (+1 spell level)."}'),
('builtin','Still Spell','still-spell','metamagic','{"feat_type":"metamagic","benefit":"Cast without somatic components (+1 spell level)."}'),
-- Item creation
('builtin','Scribe Scroll','scribe-scroll','item-creation','{"feat_type":"item-creation","prerequisites":{"casterLevel":1},"benefit":"Create magic scrolls."}'),
('builtin','Brew Potion','brew-potion','item-creation','{"feat_type":"item-creation","prerequisites":{"casterLevel":3},"benefit":"Create potions of 3rd-level or lower spells."}'),
('builtin','Craft Wondrous Item','craft-wondrous-item','item-creation','{"feat_type":"item-creation","prerequisites":{"casterLevel":3},"benefit":"Create a wide variety of magic wondrous items."}'),
('builtin','Craft Magic Arms and Armor','craft-magic-arms-and-armor','item-creation','{"feat_type":"item-creation","prerequisites":{"casterLevel":5},"benefit":"Create magic weapons, armor, and shields."}');

select count(*) as feats from feats where source = 'builtin';