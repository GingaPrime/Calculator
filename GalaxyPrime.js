





var PRIME_CERTATNTY = 100;	// 素数計算の確度(100-100/4^n)%の確率で素数

/**
 * 歌詞コード、基数、要素数を指定し、条件を満たす銀河素数の有無を判別する。
 * @param radix			基数
 * @param lyrics		歌詞
 * @return 計算結果
 */
function getResultGINGA(radix,lyrics){
	// 最小素数を取得
	var minPrime =bigInt.zero;
	minPrime = getMinPrime(radix,lyrics);
	// 素数が存在しない場合結果を出力して終了
	if(bigInt(minPrime).equals(bigInt.zero)){
		document.write("radix:	<B>" + radix + "</B>	result:	<B>false</B><BR>")
		document.write("基数" + radix + "の場合素数が存在しない<BR>")
		return
	}

	// 最大素数を取得
	var maxPrime = bigInt.zero;
	maxPrime = getMaxPrime(radix,lyrics);

	var minPrimeStr = bigInt(minPrime).toString(radix);
	var maxPrimeStr = bigInt(maxPrime).toString(radix);

	// 銀河素数判定を行う
	var result = isGingaPrimeOrPseudoGingaPrime(radix
			, bigInt(minPrime).add(maxPrime)
			,lyrics[0].length);

	// 判定結果がTrueで、擬銀河素数でもなければ銀河素数確定
	var check = false;
	if(result
			&&!isPseudoGingaPrime(radix,minPrime)
			&&!isPseudoGingaPrime(radix,maxPrime)) {
		check = true;
	}

	document.write("radix:	<B>" + radix + "</B>	result:	<B>"+check+"</B><BR>")
	document.write(minPrimeStr+"<BR>")
	document.write(maxPrimeStr+"<BR>")
	return check;
}
/**
 * 擬銀河素数判別
 */
function isPseudoGingaPrime(radix,num){
	var bf = [];
	bf = bigInt(num).toArray(radix);
	for(var i;i<bf.length;i++){
		if(bf[i]==0){
			return true;
		}
	}
	return false;
}
/**
 * 対象の2つの素数が銀河素数,または擬銀河素数でないか判定する（擬銀河素数のばあい）
 * @param radix 基数
 * @param sum　minとMaxの合計値
 * @param lyricSize 歌詞の長さ
 * @return 判定結果
 */
function isGingaPrimeOrPseudoGingaPrime(radix,sum,lyricSize){
	var bf = new Array(lyricSize).fill(radix);
	if(bigInt.fromArray(bf, radix).equals(sum)){
		return true;
	}
	return false;
}

/**
 * 条件を満たす最小の素数を取得する
 * @param radix　基数
 * @param lyrics　歌詞
 * @return　最小の素数
 */
function getMinPrime(radix,lyrics){
	var elements = new Array(lyrics.length);
	// 存在し得る最小パターンを設定(最上位桁=0は有り得ないので、歌詞がABCDなら1023から始める)
	elements[0] = 1;
	if(elements.length>=2)elements[1]=0;
	for (var i=2;i<elements.length;i++)elements[i]=i;
	// 最上位桁が桁溢れするまでループ
	while(elements[0]!=radix){
		var bf = getMultiplyNum(radix,lyrics,elements);
		if(bf.isProbablePrime(PRIME_CERTATNTY))return bf;
		elements = nextMinElements(radix, elements);
	}
	return bigInt.ZERO;
}
/**
 * 条件を満たす最大の素数を取得する
 * @param radix　基数
 * @param lyrics　歌詞
 * @return　最小の素数
 */
function getMaxPrime(radix,lyrics){
	var elements = new Array(lyrics.length);
	// 取り得る最大の数を設定
	for (var i=0;i<elements.length;i++)elements[i]=radix-1-i;

	// 最上位桁が0になるまでループ
	while(elements[0]!=0){
		var bf = getMultiplyNum(radix,lyrics,elements);
		if(bf.isProbablePrime(PRIME_CERTATNTY))return bf;
		elements = nextMaxElements(radix, elements);
	}
	return bigInt.ZERO;
}
/**
 * 今設定されている値の次に小さなelementパターンを取得する。
 */
function nextMinElements(radix,elements){
	// 使用済みの数字をチェック
	var checker = new Array(radix);
	for(var i=0;i<checker.length;i++)checker[i]=false;
	for(var i=0;i<elements.length;i++)checker[elements[i]]=true;

	// 一番最後のElementから順に1増やせるか確認。増やせる空きが無ければ手前のElementへ移動
	var num = elements.length;
	var loop=true;
	while(loop) {
		num--;
		// 一番手前のElementも数字を増やせないなら処理終了
		if(num<0) {
			elements[0]=radix;
			return elements;
		}
		checker[elements[num]]=false;
		// Elementを1増やせるか、かぶりをチェック
		for(var i=elements[num]+1;i<radix;i++) {
			if(!checker[i]) {
				checker[i]=true;
				elements[num]=i;
				loop = false;
				break;
			}
		}
	}
	// 下のelementsを処理
	for(var i=num+1;i<elements.length;i++) {
		for(var n=0;n<radix;n++) {
			if(!checker[n]) {
				checker[n]=true;
				elements[i]=n;
				break;
			}
		}
	}
	return elements;
}
/**
 * 今設定されている値の次に大きなelementパターンを取得する。
 */
function nextMaxElements(radix,elements){
	// 使用済みの数字をチェック
	var checker = new Array(radix);
	for(var i=0;i<checker.length;i++)checker[i]=false;
	for(var i=0;i<elements.length;i++)checker[elements[i]]=true;

	// 一番最後のElementから順に1減らせるか確認。空きが無ければ手前のElementへ移動
	var num = elements.length;
	var loop=true;
	while(loop) {
		num--;
		// 一番手前のElementも数字を変えられないなら処理終了
		if(num<0) {
			elements[0]=0;
			return elements;
		}
		checker[elements[num]]=false;
		// Elementを1減らせるか、かぶりをチェック
		for(var i=elements[num]-1;i>=0;i--) {
			if(!checker[i]) {
				checker[i]=true;
				elements[num]=i;
				loop = false;
				break;
			}
		}
	}

	// 下のelementsを処理
	for(var i=num+1;i<elements.length;i++) {
		for(var n=radix-1;n>=0;n--) {
			if(!checker[n]) {
				checker[n]=true;
				elements[i]=n;
				break;
			}
		}
	}
	return elements;
}
/**
 * elementsをかけあわせる
 * @param radix
 * @param lyrics
 * @param elementPowers
 * @return
 */
function getMultiplyNum(radix,lyrics,elements){
	var Bi = bigInt.ZERO;
	var bf = new Array(lyrics.length).fill(new Array(lyrics[0].length));
	for(var n=0;n<lyrics.length;n++){
		for(var i=0;i<lyrics[n].length;i++){
			bf[n][i] = bigInt(lyrics[n][i]).multiply(elements[n]);
		}
		Bi = bigInt(Bi).add(bigInt.fromArray(bf[n], radix));
	}
	return Bi;
}
/**
 * 対象の歌詞と基数を用いる場合、歌詞を構成する各要素（ギンガマンの場合はABCD）にかける冪の集合を取得する
 * @param radix :基数とする値
 * @param lyrics[] :歌詞コード(圧縮版)
 */
function setElementPowers(radix,lyrics){
	var length=0;
	for (length = 0;length<lyrics.length;length++){
		if(lyrics[length]==0)break;
	}
	var powers = [];

	var sameLengthLyrics = [];
	sameLengthLyrics=changeToSameLengthLyrics(lyrics);

	// 歌詞コードに沿ってn進数の銀河数変換用値を定める
	for(var i=0;i<powers.length;i++){
		powers[i]=bigInt.ZERO;
		for(var j=0;j<sameLengthLyrics.length;j++){
			if((1&sameLengthLyrics[i]>>j)==1){
				powers[i]=powers[i].add(bigInt(radix).pow(j));
			}
		}
	}
	return powers;
}

/** 文字列置換用 */
function replaceAll( strBuffer , strBefore , strAfter ){
	return strBuffer.split(strBefore).join(strAfter);
}

/**
 * 文字列を歌詞コード配列に変換する(javascript用)
 * @param str
 * @return lyrics[][]
 */
function convertStringToLyrics(str){
	var strbf = str;
	var lyrics = [];
	var n = 0;
	while(strbf.length > 0 ){
		//先頭文字と一致するlyricを作成
		lyrics[n] = new Array(str.length).fill(0);
		for(var i=0;i<str.length;i++) {
			if(str[i]==strbf[0])lyrics[n][i]=1;
		}
		// strbfから1文字目を削除
		strbf = replaceAll(strbf,strbf[0],"");
		n++;
	}
	return lyrics;
}


/**
 * 対象の歌詞が必ず合成数になるか
 * @param lyrics
 * @return true:必ず合成数	false:素数を持ち得る
 */
function isCompositeLyric(lyrics) {
	if(lyrics.length==1){
		if(bigInt.fromArray(lyrics[0],2).equals(bigInt.one)
			||bigInt.fromArray(lyrics[0],2).isProbablePrime(PRIME_CERTATNTY)){
			return false;
		}
		return true;
	}
	var bf = [];
	for(var i = 0;i<lyrics.length;i++) {
		bf[i] = bigInt.fromArray(lyrics[i],2);
	}
	var gcdbf = bf[0];
	for(var i = 1;i<bf.length;i++) {
		gcdbf = bigInt.gcd(bf[i],gcdbf);
		if(gcdbf==1)return false;
	}
	return true;
}

/**
 * 圧縮された歌詞コーﾄﾞを全て同じ長さに展開する(例)
 * A 101000000100→101000000100
 * B    110010101→010100101001
 * C         1110→000011010000
 * D            1→000000000010
 */
function changeToSameLengthLyrics(lyrics){
	var returnint = [];
	var buf = [];

	for (var i=0;i<lyrics.length;i++){
		returnint[i]=0;
		buf[i]=lyrics[i];
	}
	returnint[0]=buf[0];
	var used=buf[0];

	for (var i=1;i<buf.length;i++){
		if(buf[i]==0)break;
		for (var n=0;n<buf.length;n++){
			if((1&(used>>n))==1){
				buf[i]<<=1;
			}else if((1&(buf[i]>>n))==1){
				returnint[i]=returnint[i]|(1<<n);
			}
		}
		used=used|returnint[i];
	}
	return returnint;
}
/**最大公約数
 * @param a
 * @param b
 * @return
 */
function gcd (a,b) {
	return b>0?gcd(b,a%b):a;
}

