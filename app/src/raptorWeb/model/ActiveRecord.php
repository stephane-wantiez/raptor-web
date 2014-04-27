<?php

namespace raptorWeb\model;

abstract class ActiveRecord
{	
	protected $tableName;
	public $id;
	protected static $tableToClass = array();
	
	protected function __construct($tableName,$id=0)
	{
		$this->tableName = $tableName;
		$this->id = (int) $id;
	}
	
	public static function registerClass($tableName,$objectName)
	{
		self::$tableToClass[$tableName] = $objectName;
	}
	
	protected static function createRecordForTable($tableName)
	{
		if (isset(self::$tableToClass[$tableName])) return new self::$tableToClass[$tableName];
		return null;
	}
	
	protected static function getDB()
	{
		return \raptorWeb\services\App::getInstance()->getDb();
	}
	
	protected static function debug($info)
	{
		if (DB_DEBUG) echo $info;
	}
	
	protected static function debugQuery($queryName,$query,$params=array())
	{
		if (DB_DEBUG)
		{
			$paramsStr = self::completeDebugQueryWithParams($params);
			if ($paramsStr) $paramsStr = ' - Params: ' . $paramsStr;
			self::debug('<br/>Query ' . $queryName . ' : ' . $query . $paramsStr . "<br/>");
		}
	}
	
	protected function fillWithDbTuple($tupleData)
	{
		$this->id = $tupleData->id;
	}
	
	protected function fillWithRecord($record)
	{
		$this->id        = $record->id;
		$this->tableName = $record->tableName;
	}
	
	protected abstract function getDbParamsForSaving();
	protected abstract function getDbParamsForReading();
	
	protected static function completeQueryWithParams($params,$separator=', ')
	{
		$queryParams = "";
		$firstParam = true;
		
		foreach ( $params as $paramName => $paramValue )
		{
			if (!$firstParam)
			{
				$queryParams .= $separator;
			}
				
			$queryParams .= $paramName . '=:' . $paramName ;
			$firstParam = false;
		}
		
		return $queryParams;
	}
	
	protected static function completeDebugQueryWithParams($params,$separator=', ')
	{
		$queryParams = "";
		$firstParam = true;
		
		foreach ( $params as $paramName => $paramValue )
		{
			if (!$firstParam)
			{
				$queryParams .= $separator;
			}
				
			$queryParams .= $paramName . '=' . $paramValue ;
			$firstParam = false;
		}
		
		return $queryParams;
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
	
	public function create($createParams=null)
	{
		if ($createParams == null) $createParams = $this->getDbParamsForSaving();
		
		$queryStr = 'INSERT INTO ' . $this->tableName . ' ' . self::completeCreateQueryWithParams($createParams);
		$query = self::getDB()->prepare($queryStr);
		self::debugQuery('create', $queryStr, $createParams);
			
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
	
	public static function select($tableName,$selectParams=null,$customQueryPart='',$whereParams=null,$orderParams=null,$limit=0,$returnObjects=true)
	{		
		$queryStr = 'SELECT ';
		if ($selectParams && count($selectParams))
		{
			$queryStr .= join(', ', $selectParams);
		}
		else
		{
			$queryStr .= '*';
		}
		$queryStr .= ' FROM ' . $tableName ;
		if ($customQueryPart != '')
		{
			$queryStr .= ' ' . $customQueryPart;
		}
		if ($whereParams && count($whereParams))
		{
			$queryStr .= ' WHERE ' . self::completeQueryWithParams($whereParams,' AND ') ;
		}
		if ($orderParams && count($orderParams))
		{
			$queryStr .= ' ORDER BY ' . self::completeQueryWithOrderByParams($orderParams);
		}
		if ($limit != 0)
		{
			$queryStr .= ' LIMIT ' . $limit;
		}
		 
		//die("Query: " . $queryStr);
		$query = self::getDB()->prepare($queryStr);
		self::debugQuery('select', $queryStr, $selectParams);
		
	
		if (!$query->execute($whereParams))
		{
			throw new DbException("Couldn't load ' . $this->tableName . ' with keys ' . $dbParams . ' from DB");
		}
		
		$res = array();
		
		while($tuple = $query->fetch())
		{
			if ($returnObjects)
			{
				$record = self::createRecordForTable($tableName);
				$record->fillWithDbTuple($tuple);
				$res[] = $record;
			}
			else
			{
				$res[] = $tuple;
			}
		}
		
		return $res;
	}
	
	public function read($readParams=null)
	{
		if ($readParams == null) $readParams = array( 'id' => $this->id );
		
		$res = self::select( $this->tableName, null, '', $readParams, null, 1 );
		
		if ($res && count($res))
		{
			$this->fillWithRecord($res[0]);
			return true;
		}
		else
		{
			return false;
		}
	}
	
	public function readWithId($id)
	{
		return $this->read(array( 'id' => $id ));
	}
	
	public function update($updateParams=null,$selectParams=null)
	{
		if ($updateParams == null) $updateParams = $this->getDbParamsForSaving();
		if ($selectParams == null) $selectParams = array( 'id' => $this->id );
		
		$updateQueryParams = self::completeQueryWithParams($updateParams) ;
		$selectQueryParams = self::completeQueryWithParams($selectParams, ' AND ') ;
		$allParams = array_merge($updateParams,$selectParams);
		
		$queryStr = 'UPDATE ' . $this->tableName . ' SET ' . $updateQueryParams . ' WHERE ' . $selectQueryParams ;	
		$query = self::getDB()->prepare($queryStr);
		self::debugQuery('update', $queryStr, $allParams);
	
		if (!$query->execute($allParams))
		{
			throw new DbException("Couldn't load ' . $this->tableName . ' with keys ' . $dbParams . ' from DB");
		}
	}
	
	public static function bulkDelete($tableName,$deleteParams)
	{			
		$deleteQueryParams = self::completeQueryWithParams($deleteParams, ' AND ') ;
	
		$queryStr = 'DELETE FROM ' . $tableName . ' WHERE ' . $deleteQueryParams ;
		$query = self::getDB()->prepare($queryStr);
		self::debugQuery('delete', $queryStr, $deleteParams);
	
		if (!$query->execute($deleteParams))
		{
			throw new DbException('Couldn\'t execute delete query with keys ' . $dbParams . ' on DB');
		}
	}
	
	public function delete($deleteParams=null)
	{
		if ($deleteParams == null) $deleteParams = array( 'id' => $this->id );
		self::bulkDelete($this->tableName, $deleteParams);
	}
}