<?php

namespace raptorWeb\model;

class Level
{
	private static function readLevelProperties($levelNumber,&$level)
	{
		$db = \raptorWeb\services\App::getInstance()->getDb();
		
		$queryStr  = 'SELECT *';
		$queryStr .= ' FROM level';
		$queryStr .= ' WHERE number=:number';
		
		$query = $db->prepare($queryStr);
		
		if (!$query->execute(array( 'number' => $levelNumber )))
		{
			throw new DbException("Couldn't load level with number ' . $levelNumber . ' from DB");
		}
		
		$levelTuple = $query->fetch();
		if (!$levelTuple) return false;
		
		$level['id'] = $levelTuple->id;
		$level['number'] = $levelNumber;
		$level['name'] = $levelTuple->name;
		$level['background'] = $levelTuple->background;
		$level['musics'] = array();
		$level['musics']['fight'  ] = $levelTuple->music_fight;
		$level['musics']['boss'   ] = $levelTuple->music_boss;
		$level['musics']['victory'] = $levelTuple->music_victory;
		$level['musics']['defeat' ] = $levelTuple->music_defeat;
		
		return true;
	}
	
	private static function readLevelId($levelNumber)
	{
		$db = \raptorWeb\services\App::getInstance()->getDb();
	
		$queryStr  = 'SELECT id';
		$queryStr .= ' FROM level';
		$queryStr .= ' WHERE number=:number';
	
		$query = $db->prepare($queryStr);
	
		if (!$query->execute(array( 'number' => $levelNumber )))
		{
			throw new DbException("Couldn't load level with number ' . $levelNumber . ' from DB");
		}
	
		if ($levelTuple = $query->fetch())
		{
			return $levelTuple->id;
		}
		
		return -1;
	}
	
	private static function readLevelEnemies(&$level)
	{
		$db = \raptorWeb\services\App::getInstance()->getDb();
		
		$queryStr  = 'SELECT e.pos_x posX, e.pos_y posY, et.type type, et.boss boss';
		$queryStr .= ' FROM enemy e';
		$queryStr .= ' LEFT JOIN enemy_type et';
		$queryStr .= ' ON e.type=et.id';
		$queryStr .= ' WHERE e.level=:level';
		
		$query = $db->prepare($queryStr);
		
		if (!$query->execute(array( 'level' => $level['id'] )))
		{
			throw new DbException("Couldn't load enemies of level with id ' . $level->id . ' from DB");
		}
		
		$level['boss'] = array();
		$level['enemies'] = array();
		
		while($enemyTuple = $query->fetch())
		{
			$enemy = array();
			$enemy['type'] = $enemyTuple->type;
			$enemy['posX'] = (int) $enemyTuple->posX;
			$enemy['posY'] = (int) $enemyTuple->posY;
				
			if ($enemyTuple->boss)
			{
				$level['boss'][] = $enemy;
			}
			else
			{
				$level['enemies'][] = $enemy;
			}
		}
	}
	
	public static function readLevel($levelNumber)
	{
		$level = array();		
		$levelFound = self::readLevelProperties($levelNumber, $level);
		
		if ($levelFound)
		{
			self::readLevelEnemies($level);
			return $level;
		}
		
		return null;
	}
	
	private static function insertLevelProperties($level)
	{
		$db = \raptorWeb\services\App::getInstance()->getDb();
		
		$queryStr  = 'INSERT INTO level';
		$queryStr .= ' (  name,  number,  background,  music_boss,  music_defeat,  music_fight,  music_victory )';
		$queryStr .= ' VALUES';
		$queryStr .= ' ( :name, :number, :background, :music_boss, :music_defeat, :music_fight, :music_victory )';
		
		$levelParams = array();
		$levelParams['name'         ] = $level['name'      ];
		$levelParams['number'       ] = $level['number'    ];
		$levelParams['background'   ] = $level['background'];
		$levelParams['music_boss'   ] = $level['musics']['boss'   ];
		$levelParams['music_defeat' ] = $level['musics']['defeat' ];
		$levelParams['music_fight'  ] = $level['musics']['fight'  ];
		$levelParams['music_victory'] = $level['musics']['victory'];
		
		$query = $db->prepare($queryStr);
		
		if (!$query->execute($levelParams))
		{
			throw new DbException("Couldn't insert level properties into DB");
		}
	}
	
	private static function readEnemyTypeId($enemyType)
	{
		$db = \raptorWeb\services\App::getInstance()->getDb();
		
		$queryStr  = 'SELECT id';
		$queryStr .= ' FROM enemy_type et';
		$queryStr .= ' WHERE et.type=:type';
		
		$query = $db->prepare($queryStr);
		
		if (!$query->execute(array( 'type' => $enemyType )))
		{
			throw new DbException("Couldn't load enemy type with type ' . $enemyType . ' from DB");
		}
		
		if ($tuple = $query->fetch())
		{
			return (int) $tuple->id;
		}
		
		return -1;
	}
	
	private static function insertEnemyType($enemyType,$boss)
	{
		$db = \raptorWeb\services\App::getInstance()->getDb();
		
		$queryStr  = 'INSERT INTO enemy_type';
		$queryStr .= ' (  name,  type,  boss )';
		$queryStr .= ' VALUES';
		$queryStr .= ' ( :name, :type, :boss )';
		
		$enemyTypeParams = array();
		$enemyTypeParams['name'] = $enemyType;
		$enemyTypeParams['type'] = $enemyType;
		$enemyTypeParams['boss'] = $boss;
		
		$query = $db->prepare($queryStr);
		
		if (!$query->execute($enemyTypeParams))
		{
			throw new DbException("Couldn't insert enemy type ' . $enemyType . ' into DB");
		}
	}
	
	private static function checkForEnemyTypeId($enemyType,$boss,&$enemyTypeIdCache)
	{
		if (isset($enemyTypeIdCache[$enemyType])) return $enemyTypeIdCache[$enemyType];
		
		$id = self::readEnemyTypeId($enemyType);
		if ($id == -1)
		{
			self::insertEnemyType($enemyType, $boss);
			$id = self::readEnemyTypeId($enemyType);
			if ($id == -1) throw new DbException("Can't add a new enemy type ' . $enemyType . ' into DB");
		}
		
		$enemyTypeIdCache[$enemyType] = $id;
		return $id;
	}
	
	private static function insertLevelEnemy($levelId,$enemy,$enemyTypeId)
	{
		$db = \raptorWeb\services\App::getInstance()->getDb();
		
		$queryStr  = 'INSERT INTO enemy';
		$queryStr .= ' (  type,  level,  pos_x,  pos_y )';
		$queryStr .= ' VALUES';
		$queryStr .= ' ( :type, :level, :pos_x, :pos_y )';
		
		$enemyParams = array();
		$enemyParams['type' ] = $enemyTypeId;
		$enemyParams['level'] = $levelId;
		$enemyParams['pos_x'] = $enemy['posX'];
		$enemyParams['pos_y'] = $enemy['posY'];
		
		$query = $db->prepare($queryStr);
		
		if (!$query->execute($enemyParams))
		{
			throw new DbException("Couldn't insert enemy into DB");
		}
	}
	
	private static function insertLevelEnemies($levelId, &$level)
	{		
		$enemyTypeIdCache = array();
		
		foreach ($level['boss'] as $boss)
		{
			$bossTypeId = self::checkForEnemyTypeId($boss['type'], true, $enemyTypeIdCache);
			self::insertLevelEnemy($levelId, $boss, $bossTypeId);
		}
		
		foreach ($level['enemies'] as $enemy)
		{
			$enemyTypeId = self::checkForEnemyTypeId($enemy['type'], false, $enemyTypeIdCache);
			self::insertLevelEnemy($levelId, $enemy, $enemyTypeId);
		}
	}
	
	public static function insertLevel(&$level)
	{
		self::insertLevelProperties($level);
		
		$levelId = self::readLevelId($level['number']);
		if ($levelId == -1) throw new DbException("Can't read id of level with number " . $level['number']);
		
		self::insertLevelEnemies($levelId, $level);
	}
	
	public static function insertLevelFromFile($levelFilePath)
	{
		if ($fileContent = file_get_contents($levelFilePath))
		{
			$level = json_decode($fileContent, true);
			
			if (isset($level['name']) && isset($level['number']))
			{
				self::insertLevel($level);
				return true;
			}	
		}
		
		return false;
	}
}