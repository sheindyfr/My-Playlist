<?php>
$data = [
    ["artist_name"=> "חנן בן ארי","name"=>"שמש", "id"=>"AmKkovDO1_w"],
    ["artist_name"=> "חנן בן ארי","name"=>"אם תרצי", "id"=>"Y-_XAt1OFNI"],
    ["artist_name"=> "חנן בן ארי","name"=>"אלוף העולם", "id"=>"jlCNqyY-fAk"],
    ];
header('Content-Type: application/json');
echo json_encode($data);