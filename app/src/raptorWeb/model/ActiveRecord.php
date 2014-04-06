<?php

namespace raptorWeb\model;

abstract class ActiveRecord
{	
	private static $DEBUG_MODE = FALSE;
	protected $tableName;
	protected $id;
	
	protected function ActiveRecord($tableName,$id=0)
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
	
	protected abstract function createRecord();
	
	protected function fillWithDbTuple($tupleData)
	{
		$this->id = $tupleData['id'];
	}
	
	protected abstract function getDbParamsForModification();
	protected abstract function getDbParamsForReading();
	
	public function toJSON($params)
	{
		if (!$params) $params = [ 'id' => $this->id ];
		return json_encode($params);
	}
	
	protected static function completeQueryWithParams($readParams,$separator=', ')
	{
		$queryParams = "";
		$firstParam = true;
		
		foreach ( $readParams as $paramName => $paramValue )
		{
			if (!$firstParam)
			{
				$queryParams .= $separator;
			}
				
			$queryParams .= $paramName . '=:' . $paramName ;
			$firstParam = false;
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
				$queryParams .= ', ';
				$queryValues .= ', ';
			}
			
			$queryParams .= $paramName;
			$queryValues .= ':' . $paramName;
			$firstParam = false;
		}
		
		return '(  ' . $queryParams . ' ) VALUES ( ' . $queryValues . ' )' ;
	}
	
	protected static function completeQueryWithOrderByParams($orderByParams)
	{
		$firstParam = true;
		$orderByStr = "";
		
		foreach ( $orderByParams as $orderByParam => $orderByDirection )
		{
			if (!$firstParam)
			{
				$orderByStr .= ', ';
			}
			
			$orderByStr .= $orderByParam . ' ' . $orderByDirection ;
			$firstParam = false;
		}
		
		return $orderByStr;
	}
	
	public function create($createParams)
	{
		$db = App::getInstance()->getDb();
		if ($createParams == null) $createParams = $this->getDbParamsForModification();
		
		$queryStr = 'INSERT INTO ' . $this->tableName . ' ' . self::completeCreateQueryWithParams($createParams);
		$query = $db->prepare($queryStr);
		self::debugQuery('create', $queryStr);
			
		if (!$query->execute($createParams))
		{
			throw new DbException("Couldn't execute insert ' . $this->tableName . ' into DB");
		}
		
		$this->read($this->getDbParamsForReading());
	}
	
	public function setUserWithDBValues($data)
	{
		$this->id = $data->id;
	}
	
	public static function select($tableName,$selectParams,$orderParams = null)
	{
		$db = App::getInstance()->getDb();
		
		$queryStr = 'SELECT * FROM ' . $tableName ;
		$queryStr .= ' WHERE ' . self::completeQueryWithParams($selectParams,' AND ') ;
		if ($orderParams && count($orderParams))
		{
			$queryStr .= ' ORDER BY ' . self::completeQueryWithOrderByParams($orderParams);
		}
		 	
		$query = $db->prepare($queryStr);
		self::debugQuery('select', $queryStr);
	
		if (!$query->execute($selectParams))
		{
			throw new DbException("Couldn't load ' . $this->tableName . ' with keys ' . $dbParams . ' from DB");
		}
		
		$tuples = $query->fetchAll();
		$res = [];
		
		if ($tuples)
		{
			foreach( $tuples as $tuple )
			{
				$record = $this->createRecord();
				$record->fillWithDbTuple($tuple);
				$res[] = $record;
			}
		}
		
		return $res;
	}
	
	public function read($readParams)
	{
		if ($readParams == null) $readParams = [ 'id' => $this->id ];
		
		$res = self::select($this->tableName,$readParams);
		
		if ($res && count($res))
		{
			$this = $res[0];
			return true;
		}
		else
		{
			return false;
		}
	}
	
	public function readWithId($id)
	{
		return $this->read([ 'id' => $id ]);
	}
	
	public function update($updateParams,$selectParams)
	{
		$db = App::getInstance()->getDb();
		if ($updateParams == null) $updateParams = $this->getDbParamsForModification();
		if ($selectParams == null) $selectParams = [ 'id' => $this->id ];
		
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
	
	public static function bulkDelete($tableName,$deleteParams)
	{
		$db = App::getInstance()->getDb();
			
		$deleteQueryParams = self::completeQueryWithParams($deleteParams, ' AND ') ;
	
		$queryStr = 'DELETE FROM ' . $tableName . ' WHERE ' . $deleteQueryParams ;
		$query = $db->prepare($queryStr);
		self::debugQuery('delete', $queryStr);
	
		if (!$query->execute($deleteParams))
		{
			throw new DbException('Couldn\'t execute delete query with keys ' . $dbParams . ' on DB');
		}
	}
	
	public function delete($deleteParams)
	{
		if ($deleteParams == null) $deleteParams = [ 'id' => $this->id ];
		self::bulkDelete($this->tableName, $deleteParams);
	}
}