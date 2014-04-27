<?php

namespace raptorWeb\model;

class Config
{
	public static function read()
	{
		$db = \raptorWeb\services\App::getInstance()->getDb();
		
		$queryStr = 'SELECT c.identifier id, c.value value, ct.identifier type';
		$queryStr .= ' FROM config c';
		$queryStr .= ' LEFT JOIN config_type ct';
		$queryStr .= ' ON c.type=ct.id';
		 	
		$query = $db->prepare($queryStr);
	
		if (!$query->execute())
		{
			throw new DbException("Couldn't load config from DB");
		}
		
		$configTuples = $query->fetchAll();
		$config = array();
		
		if ($configTuples)
		{
			foreach( $configTuples as $configTuple )
			{
				if (!isset($config[$configTuple->type]))
				{
					$config[$configTuple->type] = array();
				}
				
				$config[$configTuple->type][$configTuple->id] = (double) $configTuple->value;
			}
		}
		
		return $config;
	}
}