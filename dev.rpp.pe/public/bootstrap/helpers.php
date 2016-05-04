<?php
function get_ip() {
    if ( function_exists( 'apache_request_headers' ) ) {
      $headers = apache_request_headers();
    } else {
      $headers = $_SERVER;

    }
    if ( array_key_exists( 'X-Forwarded-For', $headers ) && filter_var( $headers['X-Forwarded-For'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) ) {

      $the_ip = $headers['X-Forwarded-For'];

    } elseif ( array_key_exists( 'HTTP_X_FORWARDED_FOR', $headers ) && filter_var( $headers['HTTP_X_FORWARDED_FOR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 )
    ) {

      $the_ip = $headers['HTTP_X_FORWARDED_FOR'];

    } else {
      
      $the_ip = filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 );

    }
    return $the_ip;
  }

  function get_user_id($longip)
  {
  	 $unique_id=false;
     if($longip>0)
     {
      $unique_id = $longip%1000000;
      if($unique_id<=0)$unique_id = rand(1,99999);
     }else{
      $unique_id = rand(1,99999);
     }
     return $unique_id;
  }

  function load_ref($key=':')
  {
    $ref = array();
    if(!empty(@$_GET['ns_source']))
    {
       $ref[] = "ns_source$key".$_GET['ns_source'];
    }

    if(!empty(@$_GET['ns_mchannel']))
    {
      $ref[] =  "ns_mchannel$key".$_GET['ns_mchannel'];
    }

    if(!empty(@$_GET['ns_campaign']))
    {
      $ref[] =  "ns_campaign$key".$_GET['ns_campaign'];
    }

    if(!empty(@$_GET['ns_linkname']))
    {
      $ref[] =  "ns_linkname$key".$_GET['ns_linkname'];
    }
    
    return $ref /*= implode(":",$ref)*/;
  }
  
