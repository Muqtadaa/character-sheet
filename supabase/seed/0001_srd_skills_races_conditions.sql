-- ============================================================================
-- SRD builtin seed (1/3): skills, core races, conditions.
-- Idempotent: clears existing builtin rows for these tables, then re-inserts.
-- `data` JSONB matches the Zod shapes in src/lib/schemas/content.ts.
-- ============================================================================

delete from skills where source = 'builtin';
delete from races where source = 'builtin';
delete from conditions where source = 'builtin';

-- ---- Skills (key ability, armor-check-penalty, trained-only, synergies) ----
insert into skills (source, name, slug, key_ability, armor_check_penalty, trained_only, data) values
('builtin','Appraise','appraise','int',false,false,'{}'),
('builtin','Balance','balance','dex',true,false,'{}'),
('builtin','Bluff','bluff','cha',false,false,'{"synergies":[{"fromSkillId":"bluff","ranks":5,"bonus":2,"toSkillId":"diplomacy"},{"fromSkillId":"bluff","ranks":5,"bonus":2,"toSkillId":"intimidate"},{"fromSkillId":"bluff","ranks":5,"bonus":2,"toSkillId":"sleight-of-hand"}]}'),
('builtin','Climb','climb','str',true,false,'{}'),
('builtin','Concentration','concentration','con',false,false,'{}'),
('builtin','Craft','craft','int',false,false,'{}'),
('builtin','Decipher Script','decipher-script','int',false,true,'{"synergies":[{"fromSkillId":"decipher-script","ranks":5,"bonus":2,"toSkillId":"use-magic-device"}]}'),
('builtin','Diplomacy','diplomacy','cha',false,false,'{}'),
('builtin','Disable Device','disable-device','int',false,true,'{}'),
('builtin','Disguise','disguise','cha',false,false,'{}'),
('builtin','Escape Artist','escape-artist','dex',true,false,'{"synergies":[{"fromSkillId":"escape-artist","ranks":5,"bonus":2,"toSkillId":"use-rope"}]}'),
('builtin','Forgery','forgery','int',false,false,'{}'),
('builtin','Gather Information','gather-information','cha',false,false,'{}'),
('builtin','Handle Animal','handle-animal','cha',false,true,'{"synergies":[{"fromSkillId":"handle-animal","ranks":5,"bonus":2,"toSkillId":"ride"}]}'),
('builtin','Heal','heal','wis',false,false,'{}'),
('builtin','Hide','hide','dex',true,false,'{}'),
('builtin','Intimidate','intimidate','cha',false,false,'{}'),
('builtin','Jump','jump','str',true,false,'{"synergies":[{"fromSkillId":"jump","ranks":5,"bonus":2,"toSkillId":"tumble"}]}'),
('builtin','Knowledge (Arcana)','knowledge-arcana','int',false,true,'{"synergies":[{"fromSkillId":"knowledge-arcana","ranks":5,"bonus":2,"toSkillId":"spellcraft"}]}'),
('builtin','Knowledge (Architecture & Engineering)','knowledge-architecture','int',false,true,'{}'),
('builtin','Knowledge (Dungeoneering)','knowledge-dungeoneering','int',false,true,'{}'),
('builtin','Knowledge (Geography)','knowledge-geography','int',false,true,'{}'),
('builtin','Knowledge (History)','knowledge-history','int',false,true,'{}'),
('builtin','Knowledge (Local)','knowledge-local','int',false,true,'{}'),
('builtin','Knowledge (Nature)','knowledge-nature','int',false,true,'{"synergies":[{"fromSkillId":"knowledge-nature","ranks":5,"bonus":2,"toSkillId":"survival"}]}'),
('builtin','Knowledge (Nobility & Royalty)','knowledge-nobility','int',false,true,'{}'),
('builtin','Knowledge (The Planes)','knowledge-planes','int',false,true,'{}'),
('builtin','Knowledge (Religion)','knowledge-religion','int',false,true,'{}'),
('builtin','Listen','listen','wis',false,false,'{}'),
('builtin','Move Silently','move-silently','dex',true,false,'{}'),
('builtin','Open Lock','open-lock','dex',false,true,'{}'),
('builtin','Perform','perform','cha',false,false,'{}'),
('builtin','Profession','profession','wis',false,true,'{}'),
('builtin','Ride','ride','dex',false,false,'{}'),
('builtin','Search','search','int',false,false,'{}'),
('builtin','Sense Motive','sense-motive','wis',false,false,'{"synergies":[{"fromSkillId":"sense-motive","ranks":5,"bonus":2,"toSkillId":"diplomacy"}]}'),
('builtin','Sleight of Hand','sleight-of-hand','dex',true,true,'{}'),
('builtin','Spellcraft','spellcraft','int',false,true,'{}'),
('builtin','Spot','spot','wis',false,false,'{}'),
('builtin','Survival','survival','wis',false,false,'{}'),
('builtin','Swim','swim','str',true,false,'{}'),
('builtin','Tumble','tumble','dex',true,true,'{"synergies":[{"fromSkillId":"tumble","ranks":5,"bonus":2,"toSkillId":"jump"},{"fromSkillId":"tumble","ranks":5,"bonus":2,"toSkillId":"balance"}]}'),
('builtin','Use Magic Device','use-magic-device','cha',false,true,'{}'),
('builtin','Use Rope','use-rope','dex',false,false,'{"synergies":[{"fromSkillId":"use-rope","ranks":5,"bonus":2,"toSkillId":"escape-artist"}]}');

-- ---- Core races ----
insert into races (source, name, slug, data) values
('builtin','Human','human','{"size":"medium","speed":30,"bonusSkillPointsPerLevel":1,"languages":["Common"],"traits":["Bonus feat at 1st level","Bonus skill point per level"]}'),
('builtin','Dwarf','dwarf','{"size":"medium","speed":20,"abilityAdjustments":{"con":2,"cha":-2},"languages":["Common","Dwarven"],"traits":["Darkvision 60 ft.","Stonecunning","+2 vs poison","+2 vs spells and spell-like abilities","+1 attack vs orcs and goblinoids","+4 dodge AC vs giants","Stability"]}'),
('builtin','Elf','elf','{"size":"medium","speed":30,"abilityAdjustments":{"dex":2,"con":-2},"languages":["Common","Elven"],"traits":["Low-light vision","Immunity to sleep","+2 vs enchantment","+2 Listen, Search, Spot","Martial weapon proficiency (longsword, rapier, longbow, shortbow)"]}'),
('builtin','Gnome','gnome','{"size":"small","speed":20,"abilityAdjustments":{"con":2,"str":-2},"languages":["Common","Gnome"],"traits":["Low-light vision","+2 vs illusions","+1 attack vs kobolds and goblinoids","+4 dodge AC vs giants","+2 Listen, +2 Craft (alchemy)","Spell-like abilities"]}'),
('builtin','Half-Elf','half-elf','{"size":"medium","speed":30,"languages":["Common","Elven"],"traits":["Low-light vision","Immunity to sleep","+2 vs enchantment","+1 Listen, Search, Spot","+2 Diplomacy and Gather Information"]}'),
('builtin','Half-Orc','half-orc','{"size":"medium","speed":30,"abilityAdjustments":{"str":2,"int":-2,"cha":-2},"languages":["Common","Orc"],"traits":["Darkvision 60 ft.","Orc blood"]}'),
('builtin','Halfling','halfling','{"size":"small","speed":20,"abilityAdjustments":{"dex":2,"str":-2},"languages":["Common","Halfling"],"traits":["+1 on all saves","+2 vs fear","+1 attack with thrown weapons and slings","+2 Climb, Jump, Listen, Move Silently"]}');

-- ---- Conditions (description + best-effort engine-compatible effect templates) ----
insert into conditions (source, name, slug, data) values
('builtin','Blinded','blinded','{"description":"-2 AC, loses Dex to AC, half speed, -4 on most Str/Dex skills.","effects":[{"target":"ac","bonusType":"untyped","value":-2}]}'),
('builtin','Dazzled','dazzled','{"description":"-1 on attack rolls and Spot/Search.","effects":[{"target":"attack","bonusType":"untyped","value":-1}]}'),
('builtin','Deafened','deafened','{"description":"-4 on initiative, 20% spell failure for verbal spells.","effects":[{"target":"initiative","bonusType":"untyped","value":-4}]}'),
('builtin','Entangled','entangled','{"description":"-2 attack, -4 Dex, half speed.","effects":[{"target":"attack","bonusType":"untyped","value":-2},{"target":"ability:dex","bonusType":"untyped","value":-4}]}'),
('builtin','Fatigued','fatigued','{"description":"-2 Str and Dex; cannot run or charge.","effects":[{"target":"ability:str","bonusType":"untyped","value":-2},{"target":"ability:dex","bonusType":"untyped","value":-2}]}'),
('builtin','Exhausted','exhausted','{"description":"-6 Str and Dex; half speed.","effects":[{"target":"ability:str","bonusType":"untyped","value":-6},{"target":"ability:dex","bonusType":"untyped","value":-6}]}'),
('builtin','Shaken','shaken','{"description":"-2 morale on attacks, saves, skills, ability checks.","effects":[{"target":"attack","bonusType":"morale","value":-2},{"target":"save:fort","bonusType":"morale","value":-2},{"target":"save:ref","bonusType":"morale","value":-2},{"target":"save:will","bonusType":"morale","value":-2}]}'),
('builtin','Frightened','frightened','{"description":"Like shaken (-2) and must flee.","effects":[{"target":"attack","bonusType":"morale","value":-2},{"target":"save:fort","bonusType":"morale","value":-2},{"target":"save:ref","bonusType":"morale","value":-2},{"target":"save:will","bonusType":"morale","value":-2}]}'),
('builtin','Panicked','panicked','{"description":"-2 morale on saves; drops items and flees.","effects":[{"target":"save:fort","bonusType":"morale","value":-2},{"target":"save:ref","bonusType":"morale","value":-2},{"target":"save:will","bonusType":"morale","value":-2}]}'),
('builtin','Sickened','sickened','{"description":"-2 on attacks, weapon damage, saves, skills, ability checks.","effects":[{"target":"attack","bonusType":"untyped","value":-2},{"target":"save:fort","bonusType":"untyped","value":-2},{"target":"save:ref","bonusType":"untyped","value":-2},{"target":"save:will","bonusType":"untyped","value":-2}]}'),
('builtin','Nauseated','nauseated','{"description":"Can only take a single move action; no attacks or spells.","effects":[]}'),
('builtin','Stunned','stunned','{"description":"-2 AC, loses Dex to AC, drops what it is holding.","effects":[{"target":"ac","bonusType":"untyped","value":-2}]}'),
('builtin','Prone','prone','{"description":"-4 on melee attacks; +4 AC vs ranged, -4 AC vs melee.","effects":[{"target":"attack:melee","bonusType":"untyped","value":-4}]}'),
('builtin','Flat-Footed','flat-footed','{"description":"Loses Dex bonus to AC; cannot make attacks of opportunity.","effects":[]}'),
('builtin','Cowering','cowering','{"description":"-2 AC and loses Dex to AC.","effects":[{"target":"ac","bonusType":"untyped","value":-2}]}'),
('builtin','Helpless','helpless','{"description":"Dex treated as 0 (-5); melee attackers get +4 to hit.","effects":[]}');
