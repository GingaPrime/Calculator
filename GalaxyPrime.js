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
		document.write("<tr><th>")
		document.write(radix)
		document.write("</th>")
		document.write("<td class=\"txt\" colspan=\"3\">")
		document.write("※基数" + radix + "の場合素数は存在しません")
		document.write("</td></tr>")

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

	document.write("<tr><th>" + radix + "</th>")
	document.write("<td class=\"txt\">")
	document.write(minPrimeStr+"<BR>")
	document.write(maxPrimeStr+"<BR>")
	document.write(bigInt(minPrime).add(maxPrime).toString(radix))
	document.write("</td>")
	if(!check)document.write("<td class=\"bold\">")
	if(check)document.write("<td class=\"bold2\">")
	document.write(check)
	document.write("</td>")
	document.write("<td class=\"txt\">")
	document.write(bigInt(minPrime).toString(10)+"<BR>")
	document.write(bigInt(maxPrime).toString(10))
	document.write("</td>")
	document.write("</tr>")
	
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



function tableheader(){
	document.write("<table>")
	document.write("		<thead>")
	document.write("			<tr>")
	document.write("				<td>基数</td>")
	document.write("				<th scope='col'>最小素数<BR>最大素数<BR>和</th>")
	document.write("				<th scope='col'>銀河判定</th>")
	document.write("				<th scope='col'>最小素数<BR>最大素数<BR>(10進数表示)</th>")
	document.write("			</tr>")
	document.write("		</thead>")
	document.write("		<tbody>")
}
function tablefooter(){
	document.write("</tbody></table>")
}

function calculator(parameter){
	var lyric = "ガンガンギギンギンガマン"
	var min = 2
	var max = 16

	var text = decodeURIComponent(parameter)
	text = text.replace(text[0],'')
	var texts = text.split('&');
	texts[0] = texts[0].replace("lyric=",'')
	if(texts[0].length!=0)lyric = texts[0]
	if(texts.length >=2){
		texts[1] = texts[1].replace("min=",'')
		if(texts[1].length!=0)min = texts[1]
	}
	if(texts.length >=3){
		texts[2] = texts[2].replace("max=",'')
		if(texts[2].length!=0)max = texts[2]
	}
	
	document.write("<h2><center>")
	document.write(lyric)
	document.write("</center></h1>")
	var lyrics = convertStringToLyrics(lyric)

	if(isCompositeLyric(lyrics)){
		document.write("<BR><center>")
		document.write("必ず合成数になる歌詞パターンです")
		document.write("</center><BR>")
	}else{
		if(min<lyrics.length)min=lyrics.length
		if(max<lyrics.length)max=lyrics.length
		
		tableheader();
		for(var i = min;i<=max;i++){
			getResultGINGA(i,lyrics);
		}
		tablefooter();
	}
}

