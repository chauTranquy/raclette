<?php
/**
 * Zend Framework
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://framework.zend.com/license/new-bsd
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@zend.com so we can send you a copy immediately.
 *
 * @category   Zend
 * @package    Zend_Captcha
 * @subpackage Adapter
 * @copyright  Copyright (c) 2005-2011 Zend Technologies USA Inc. (http://www.zend.com)
 * @license    http://framework.zend.com/license/new-bsd     New BSD License
 * @version    $Id: Image.php 23775 2011-03-01 17:25:24Z ralph $
 */

/** @see Zend_Captcha_Word */
require_once 'Zend/Captcha/Word.php';

/**
 * Image-based captcha element
 *
 * Generates image displaying random word
 *
 * @category   Zend
 * @package    Zend_Captcha
 * @subpackage Adapter
 * @copyright  Copyright (c) 2005-2011 Zend Technologies USA Inc. (http://www.zend.com)
 * @license    http://framework.zend.com/license/new-bsd     New BSD License
 */
class Zend_Captcha_Image extends Zend_Captcha_Word
{
    /**
     * Directory for generated images
     *
     * @var string
     */
    protected $_imgDir = "./images/captcha/";

    /**
     * URL for accessing images
     *
     * @var string
     */
    protected $_imgUrl = "/images/captcha/";

    /**
     * Image's alt tag content
     *
     * @var string
     */
    protected $_imgAlt = "";

    /**
     * Image suffix (including dot)
     *
     * @var string
     */
    protected $_suffix = ".png";

    /**
     * Image width
     *
     * @var int
     */
    protected $_width = 200;

    /**
     * Image height
     *
     * @var int
     */
    protected $_height = 50;

    /**
     * Font size
     *
     * @var int
     */
    protected $_fsize = 24;

    /**
     * Image font file
     *
     * @var string
     */
    protected $_font;

    /**
     * Image to use as starting point
     * Default is blank image. If provided, should be PNG image.
     *
     * @var string
     */
    protected $_startImage;
    /**
     * How frequently to execute garbage collection
     *
     * @var int
     */
    protected $_gcFreq = 10;

    /**
     * How long to keep generated images
     *
     * @var int
     */
    protected $_expiration = 600;

    /**
     * Number of noise dots on image
     * Used twice - before and after transform
     *
     * @var int
     */
    protected $_dotNoiseLevel = 100;
    /**
     * Number of noise lines on image
     * Used twice - before and after transform
     *
     * @var int
     */
    protected $_lineNoiseLevel = 5;

	/**
	 * Array with font color in RGB
	 * (default is white)
	 * 
	 * @var array
	 */
	protected $_fontColor = array(0, 0, 0);

	/**
	 * Array with font color in RGB
	 * (default is black)
	 *
	 * @var array
	 */
	protected $_backgroundColor = array(255, 255, 255);

	
	 protected $_customWord=null;
	
	
    /**
     * @return string
     */
    public function getImgAlt ()
    {
        return $this->_imgAlt;
    }
    /**
     * @return string
     */
    public function getStartImage ()
    {
        return $this->_startImage;
    }
    /**
     * @return int
     */
    public function getDotNoiseLevel ()
    {
        return $this->_dotNoiseLevel;
    }
    /**
     * @return int
     */
    public function getLineNoiseLevel ()
    {
        return $this->_lineNoiseLevel;
    }
    /**
     * Get captcha expiration
     *
     * @return int
     */
    public function getExpiration()
    {
        return $this->_expiration;
    }

    /**
     * Get garbage collection frequency
     *
     * @return int
     */
    public function getGcFreq()
    {
        return $this->_gcFreq;
    }
    /**
     * Get font to use when generating captcha
     *
     * @return string
     */
    public function getFont()
    {
        return $this->_font;
    }

    /**
     * Get font size
     *
     * @return int
     */
    public function getFontSize()
    {
        return $this->_fsize;
    }

    /**
     * Get captcha image height
     *
     * @return int
     */
    public function getHeight()
    {
        return $this->_height;
    }

    /**
     * Get captcha image directory
     *
     * @return string
     */
    public function getImgDir()
    {
        return $this->_imgDir;
    }
    /**
     * Get captcha image base URL
     *
     * @return string
     */
    public function getImgUrl()
    {
        return $this->_imgUrl;
    }
    /**
     * Get captcha image file suffix
     *
     * @return string
     */
    public function getSuffix()
    {
        return $this->_suffix;
    }
    /**
     * Get captcha image width
     *
     * @return int
     */
    public function getWidth()
    {
        return $this->_width;
    }

	/**
	 * Get font color
	 *
	 * @return array
	 */
	public function getFontColor() {
		return $this->_fontColor;
	}

	/**
	 * Get background color
	 *
	 * @return array
	 */
	public function getBackgroundColor() {
		return $this->_backgroundColor;
	}
    /**
     * @param string $startImage
     */
    public function setStartImage ($startImage)
    {
        $this->_startImage = $startImage;
        return $this;
    }
    /**
     * @param int $dotNoiseLevel
     */
    public function setDotNoiseLevel ($dotNoiseLevel)
    {
        $this->_dotNoiseLevel = $dotNoiseLevel;
        return $this;
    }
   /**
     * @param int $lineNoiseLevel
     */
    public function setLineNoiseLevel ($lineNoiseLevel)
    {
        $this->_lineNoiseLevel = $lineNoiseLevel;
        return $this;
    }

    /**
     * Set captcha expiration
     *
     * @param int $expiration
     * @return Zend_Captcha_Image
     */
    public function setExpiration($expiration)
    {
        $this->_expiration = $expiration;
        return $this;
    }

    /**
     * Set garbage collection frequency
     *
     * @param int $gcFreq
     * @return Zend_Captcha_Image
     */
    public function setGcFreq($gcFreq)
    {
        $this->_gcFreq = $gcFreq;
        return $this;
    }

    /**
     * Set captcha font
     *
     * @param  string $font
     * @return Zend_Captcha_Image
     */
    public function setFont($font)
    {
        $this->_font = $font;
        return $this;
    }

    /**
     * Set captcha font size
     *
     * @param  int $fsize
     * @return Zend_Captcha_Image
     */
    public function setFontSize($fsize)
    {
        $this->_fsize = $fsize;
        return $this;
    }

    /**
     * Set captcha image height
     *
     * @param  int $height
     * @return Zend_Captcha_Image
     */
    public function setHeight($height)
    {
        $this->_height = $height;
        return $this;
    }

    /**
     * Set captcha image storage directory
     *
     * @param  string $imgDir
     * @return Zend_Captcha_Image
     */
    public function setImgDir($imgDir)
    {
        $this->_imgDir = rtrim($imgDir, "/\\") . '/';
        return $this;
    }

    /**
     * Set captcha image base URL
     *
     * @param  string $imgUrl
     * @return Zend_Captcha_Image
     */
    public function setImgUrl($imgUrl)
    {
        $this->_imgUrl = rtrim($imgUrl, "/\\") . '/';
        return $this;
    }
    /**
     * @param string $imgAlt
     */
    public function setImgAlt ($imgAlt)
    {
        $this->_imgAlt = $imgAlt;
        return $this;
    }

    /**
     * Set captch image filename suffix
     *
     * @param  string $suffix
     * @return Zend_Captcha_Image
     */
    public function setSuffix($suffix)
    {
        $this->_suffix = $suffix;
        return $this;
    }

    /**
     * Set captcha image width
     *
     * @param  int $width
     * @return Zend_Captcha_Image
     */
    public function setWidth($width)
    {
        $this->_width = $width;
        return $this;
    }

	/**
	 * Set font color
	 *
	 * @param array $color
	 */
	public function setFontColor($color) {
		if (!is_array($color)) {
			throw new Exception("font color must be an array");
		}
		$this->_fontColor = $color;
	}

	/**
	 * Set background color
	 *
	 * @param array $color
	 */
	public function setBackgroundColor($color) {
		if (!is_array($color)) {
			throw new Exception("background color must be an array");
		}
		$this->_backgroundColor = $color;
	}

    /**
     * Generate random frequency
     *
     * @return float
     */
    protected function _randomFreq()
    {
        return mt_rand(700000, 1000000) / 15000000;
    }

    /**
     * Generate random phase
     *
     * @return float
     */
    protected function _randomPhase()
    {
        // random phase from 0 to pi
        return mt_rand(0, 3141592) / 1000000;
    }

    /**
     * Generate random character size
     *
     * @return int
     */
    protected function _randomSize()
    {
        return mt_rand(300, 700) / 100;
    }

    /**
     * Generate captcha
     *
     * @return string captcha ID
     */
    public function generate()
    {
        $id = parent::generate();
        $tries = 5;
        // If there's already such file, try creating a new ID
        while($tries-- && file_exists($this->getImgDir() . $id . $this->getSuffix())) {
            $id = $this->_generateRandomId();
            $this->_setId($id);
        }
        $this->_generateImage($id, !$this->_customWord?$this->getWord():$this->_customWord);

        if (mt_rand(1, $this->getGcFreq()) == 1) {
            $this->_gc();
        }
        return $id;
    }

    /**
     * Generate image captcha
     *
     * Override this function if you want different image generator
     * Wave transform from http://www.captcha.ru/captchas/multiwave/
     *
     * @param string $id Captcha ID
     * @param string $word Captcha word
     */
    protected function _generateImage($id, $word)
    {
        if (!extension_loaded("gd")) {
            require_once 'Zend/Captcha/Exception.php';
            throw new Zend_Captcha_Exception("Image CAPTCHA requires GD extension");
        }

        if (!function_exists("imagepng")) {
            require_once 'Zend/Captcha/Exception.php';
            throw new Zend_Captcha_Exception("Image CAPTCHA requires PNG support");
        }

        if (!function_exists("imageftbbox")) {
            require_once 'Zend/Captcha/Exception.php';
            throw new Zend_Captcha_Exception("Image CAPTCHA requires FT fonts support");
        }

        $font = $this->getFont();

        if (empty($font)) {
            require_once 'Zend/Captcha/Exception.php';
            throw new Zend_Captcha_Exception("Image CAPTCHA requires font");
        }

        $w     = $this->getWidth();
        $h     = $this->getHeight();
        $fsize = $this->getFontSize();
		$tc    = $this->getFontColor();
		$bc    = $this->getBackgroundColor();

        $img_file   = $this->getImgDir() . $id . $this->getSuffix();
        if(empty($this->_startImage)) {
            $img        = imagecreatetruecolor($w, $h);
        } else {
           // $img = imagecreatefrompng($this->_startImage);
            $bgImg = imagecreatefrompng($this->_startImage);
           imagesavealpha($bgImg, true);
   		 imagealphablending($bgImg, false);
           
            if(!$bgImg) {
                require_once 'Zend/Captcha/Exception.php';
                throw new Zend_Captcha_Exception("Can not load start image");
            }
            $w = imagesx($bgImg);
            $h = imagesy($bgImg);
             $img        = imagecreatetruecolor($w, $h);
            imagealphablending($img, true); 
  			 $alpha = imagecolorallocatealpha($img, 255, 255, 255, 127);
  			 imagefill($img, 0, 0, $alpha);
        }

        $text_color = imagecolorallocate($img, $tc[0], $tc[1], $tc[2]);
      //  $bg_color   = imagecolorallocate($img, $bc[0], $bc[1], $bc[2]);

        //imagefilledrectangle($img, 0, 0, $w-1, $h-1, $bg_color);
        $textbox = imageftbbox($fsize, 0, $font, $word);
        $x = ($w - ($textbox[2] - $textbox[0])) / 2;
        $y = ($h - ($textbox[7] - $textbox[1])) / 2;
        imagefttext($img, $fsize, 0, $x, $y, $text_color, $font, $word);

       // generate noise
        for ($i=0; $i<$this->_dotNoiseLevel; $i++) {
           imagefilledellipse($img, mt_rand(0,$w), mt_rand(0,$h), 2, 2, $text_color);
        }
        for($i=0; $i<$this->_lineNoiseLevel; $i++) {
           imageline($img, mt_rand(0,$w), mt_rand(0,$h), mt_rand(0,$w), mt_rand(0,$h), $text_color);
        }

        // transformed image
        $img2     = imagecreatetruecolor($w, $h);
         imagesavealpha($img2, true);
   		 imagealphablending($img2, false);
        $bg_color = imagecolorallocatealpha($img2, $bc[0], $bc[1], $bc[2], 127);
        imagefilledrectangle($img2, 0, 0, $w-1, $h-1, $bg_color);

		// apply wave transforms
        $freq1 = $this->_randomFreq();
        $freq2 = $this->_randomFreq();
        $freq3 = $this->_randomFreq();
        $freq4 = $this->_randomFreq();

        $ph1 = $this->_randomPhase();
        $ph2 = $this->_randomPhase();
        $ph3 = $this->_randomPhase();
        $ph4 = $this->_randomPhase();

        $szx = $this->_randomSize();
        $szy = $this->_randomSize();

        for ($x = 0; $x < $w; $x++) {
            for ($y = 0; $y < $h; $y++) {
                $sx = $x + (sin($x*$freq1 + $ph1) + sin($y*$freq3 + $ph3)) * $szx;
                $sy = $y + (sin($x*$freq2 + $ph2) + sin($y*$freq4 + $ph4)) * $szy;

                if ($sx < 0 || $sy < 0 || $sx >= $w - 1 || $sy >= $h - 1) {
                    continue;
                }
				
				$color    = $this->_getColorsAt($img, $sx, $sy);
				$color_x  = $this->_getColorsAt($img, $sx + 1, $sy);
				$color_y  = $this->_getColorsAt($img, $sx, $sy + 1);
				$color_xy = $this->_getColorsAt($img, $sx + 1, $sy + 1);

				if ($color["red"] == $bc[0] && $color["green"] == $bc[1] && $color["blue"] == $bc[2]) {
					continue;
				}

				// do antialiasing for border items
				$frac_x  = $sx-floor($sx);
				$frac_y  = $sy-floor($sy);
				$frac_x1 = 1-$frac_x;
				$frac_y1 = 1-$frac_y;

				$colors = array("red", "green", "blue");
				foreach ($colors as $c) {
					$newcolor[$c] = $color[$c]    * $frac_x1 * $frac_y1
								  + $color_x[$c]  * $frac_x  * $frac_y1
								  + $color_y[$c]  * $frac_x1 * $frac_y
								  + $color_xy[$c] * $frac_x  * $frac_y;
				}
                
                imagesetpixel($img2, $x, $y, imagecolorallocate($img2, $newcolor["red"], $newcolor["green"], $newcolor["blue"]));
               // imagesavealpha($img2,true); 
            }
        }

        // generate noise
        for ($i=0; $i<$this->_dotNoiseLevel; $i++) {
            imagefilledellipse($img2, mt_rand(0,$w), mt_rand(0,$h), 2, 2, $text_color);
        }
        for ($i=0; $i<$this->_lineNoiseLevel; $i++) {
           imageline($img2, mt_rand(0,$w), mt_rand(0,$h), mt_rand(0,$w), mt_rand(0,$h), $text_color);
        }

        
	
       if(!$bgImg) imagepng($img2, $img_file);
       else{

       	imagealphablending($img2, true);
       	imagealphablending($bgImg, true);
       //	imagecopymerge($bgImg, $img2, 0, 0, 0, 0, $w, $h, 0);
       
$x1 = imagesx($bgImg);
$y1 = imagesy($bgImg);
$x2 = imagesx($img2);
$y2 = imagesy($img2);
       	
       	
       	imagecopyresampled($bgImg,$img2, 0, 0, 0, 0, $x1, $y1, $x2, $y2);//($bgImg, $img2, 0, 0, 0, 0, $w, $h);
       	
       	imagepng($bgImg, $img_file);
       }
       
        imagedestroy($img);
        imagedestroy($img2);
    }

    /**
     * Remove old files from image directory
     *
     */
    protected function _gc()
    {
        $expire = time() - $this->getExpiration();
        $imgdir = $this->getImgDir();
        if(!$imgdir || strlen($imgdir) < 2) {
            // safety guard
            return;
        }
        $suffixLength = strlen($this->_suffix);
        foreach (new DirectoryIterator($imgdir) as $file) {
            if (!$file->isDot() && !$file->isDir()) {
                if ($file->getMTime() < $expire) {
                    // only deletes files ending with $this->_suffix
                    if (substr($file->getFilename(), -($suffixLength)) == $this->_suffix) {
                        unlink($file->getPathname());
                    }
                }
            }
        }
    }

    public function setWord($word){
    
    	if(!empty($word)) $this->_customWord=$word;
    	return $this;
    
    }
    
    /**
     * Display the captcha
     *
     * @param Zend_View_Interface $view
     * @param mixed $element
     * @return string
     */
    public function render(Zend_View_Interface $view = null, $element = null)
    {
        return '<img width="' . $this->getWidth() . '" height="' . $this->getHeight() . '" alt="' . $this->getImgAlt()
             . '" src="' . $this->getImgUrl() . $this->getId() . $this->getSuffix() . '" />';
    }

	/**
	 * Returns RGB-color code from given image position
	 *
	 * @param identifier $image
	 * @param int $x
	 * @param int $y
	 * @return array
	 */
	protected function _getColorsAt($image, $x, $y)
	{
		return imagecolorsforindex($image, imagecolorat($image, $x, $y));
	}
}