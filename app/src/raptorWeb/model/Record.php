<?php

namespace raptorWeb\model;

class Record
{	
	private static $DEBUG_MODE = FALSE;
	private $tableName;
	protected $id;
	
	private function __construct($tableName,$id=0)
	{
		$this->tableName = $tableName;
		$this->id = (int) $id;
	}
	
	protected static function debug($info)
	{
		if ($DEBUG_MODE) echo $info;
	}
	
	protected static function debugQuery($queryName,$query)
	{
		if ($DEBUG_MODE) self::debug('Query ' . $queryName . ' : ' . $query);
	}
	
	protected function toJSON($params)
	{
		return json_encode($params);
	}
	
	protected function toJSON()
	{
		return toJSON([ 'id' => $this->id ]);
	}
	
	protected static function completeQueryWithParams($readParams,$separator=', ')
	{
		$queryParams = "";
		$firstParam = true;
		
		foreach ( $readParams as $paramName => $paramValue )
		{
			if (!$firstParam)
			{
				$queryParams += $separator;
			}
				
			$queryParams += $paramName . '=:' . $paramName ;
		}
	}
	
	protected static function completeCreateQueryWithParams($createParams)
	{
		$queryParams = "";
		$queryValues = "";
		$firstParam = true;
		
		foreach ( $createParams as $paramName => $paramValue )
		{
			if (!$firstParam)
			{
				$queryParams += ', ';
				$queryValues += ', ';
			}
			
			$queryParams += $paramName;
			$queryValues += ':' . $paramName;
		}
		
		return '(  ' . $queryParams . ' ) VALUES ( ' . $queryValues . ' )' ;
	}
	
	protected function create($createParams)
	{
		$db = App::getInstance()->getDb();
		
		$queryStr = 'INSERT INTO ' . $this->tableName . ' ' . self::completeCreateQueryWithParams($createParams);
		$query = $db->prepare($queryStr);
		self::debugQuery('create', $queryStr);
			
		if (!$query->execute($createParams))
		{
			throw new DbException("Couldn't execute insert ' . $this->tableName . ' into DB");
		}
	}
	
	protected function create($createParams)
	{
		$this->create($createParams);
	}
	
	protected function setUserWithDBValues($data)
	{
		$this->id = $data->id;
	}
	
	protected function read($readParams,callable $readCallback,$callbackParams)
	{
		$db = App::getInstance()->getDb();
		
		$queryStr = 'SELECT * FROM ' . $this->tableName . ' WHERE ' . self::completeQueryWithParams($readParams,' AND ') ;	
		$query = $db->prepare($queryStr);
		self::debugQuery('read', $queryStr);
	
		if (!$query->execute($readParams))
		{
			throw new DbException("Couldn't load ' . $this->tableName . ' with keys ' . $dbParams . ' from DB");
		}
	
		call_user_func($readCallback,$query->fetch(),$callbackParams);
	}
	
	protected function read(callable $readCallback,$callbackParams)
	{
		$this->read([ 'id' => $this->id ],$readCallback,$callbackParams);
	}
	
	protected function update($updateParams,$selectParams)
	{
		$db = App::getInstance()->getDb();
		$updateQueryParams = self::completeQueryWithParams($updateParams) ;
		$selectQueryParams = self::completeQueryWithParams($readParams, ' AND ') ;
		$allParams = array_merge($updateParams,$selectParams);
		
		$queryStr = 'UPDATE ' . $this->tableName . ' SET ' . $updateQueryParams . ' WHERE ' . $selectQueryParams ;	
		$query = $db->prepare($queryStr);
		self::debugQuery('update', $queryStr);
	
		if (!$query->execute($allParams))
		{
			throw new DbException("Couldn't load ' . $this->tableName . ' with keys ' . $dbParams . ' from DB");
		}
	}
	
	protected function update($updateParams)
	{
		$this->update($updateParams,[ 'id' => $this->id ]);
	}
	
	protected function delete($deleteParams)
	{
		$db = App::getInstance()->getDb();
		$deleteQueryParams = self::completeQueryWithParams($deleteParams, ' AND ') ;
		
		$queryStr = 'DELETE FROM ' . $this->tableName . ' WHERE ' . $deleteQueryParams ;
		$query = $db->prepare($queryStr);
		self::debugQuery('delete', $queryStr);
	
		if (!$query->execute($deleteParams))
		{
			throw new DbException('Couldn\'t execute delete query with keys ' . $dbParams . ' on DB');
		}
	}
	
	protected function delete()
	{
		$this->delete([ 'id' => $this->id ]);
	}
}