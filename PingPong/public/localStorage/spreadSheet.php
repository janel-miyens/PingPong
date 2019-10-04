<?php
	dd();
	require '../vendor/autoload.php';

	use PhpOffice\PhpSpreadsheet\Spreadsheet;
	use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


	$dataCounter = 0;
	$displayTable = displayDataTable();
	$displayRowNum = getDataCounter();

	//name, email, score, win
	$dataArray = array("janel","nel@email.com","300","yes");

	$currentCounter = inputData($dataArray);
	
	function inputData($dataArray){

		$reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader('Xlsx');
		$spreadsheet = $reader->load("database.xlsx");

		$worksheet = $spreadsheet->getActiveSheet();

		$currentDataCounter =  getDataCounter() + 1;

		for($i = 0; $i < 5; $i++){

			if($i == 0){
				$spreadsheet->getActiveSheet()->setCellValueByColumnAndRow($i + 1, $currentDataCounter, $currentDataCounter);
			}
			else{
				$spreadsheet->getActiveSheet()->setCellValueByColumnAndRow($i + 1, $currentDataCounter, $dataArray[$i - 1]);
			}
			
		}

		$writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, "Xlsx");
		$writer->save("database.xlsx");

		return $currentDataCounter;
	}

	function getDataCounter(){

		$reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader('Xlsx');
		$reader->setReadDataOnly(TRUE);
		$spreadsheet = $reader->load("database.xlsx");

		$worksheet = $spreadsheet->getActiveSheet();
		$dataCounter = 0;

		foreach ($worksheet->getRowIterator() as $row) {
			$dataCounter += $worksheet->getRowIterator()->key();
		}
		return $dataCounter;
	}


	function displayDataTable(){

		$reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader('Xlsx');
		$reader->setReadDataOnly(TRUE);
		$spreadsheet = $reader->load("database.xlsx");

		$worksheet = $spreadsheet->getActiveSheet();

		$data = '<table>' . PHP_EOL;
		foreach ($worksheet->getRowIterator() as $row) {
		    $data .= '<tr>' . PHP_EOL;
		    $cellIterator = $row->getCellIterator();
		    $cellIterator->setIterateOnlyExistingCells(FALSE); // This loops through all cells,
		                                                       //    even if a cell value is not set.
		                                                       // By default, only cells that have a value
		                                                       //    set will be iterated.
		    foreach ($cellIterator as $cell) {
		        $data .= '<td>' .
		             $cell->getValue() .
		             '</td>' . PHP_EOL;
		    }
		    $data .= '</tr>' . PHP_EOL;
		}
		$data .= '</table>' . PHP_EOL;


		return $data;
	}


	return;
?>