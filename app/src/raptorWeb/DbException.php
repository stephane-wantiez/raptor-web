<?php

namespace raptorWeb;

class DbException extends \Exception
{
	public function __construct($message)
	{
		parent::__construct($message);
	}
}