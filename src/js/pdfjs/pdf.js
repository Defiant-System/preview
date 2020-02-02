/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-unused-vars */

"use strict";

const pdfjsVersion = "2.3.67";
const pdfjsBuild = "be70ee23";

import * as pdfjsSharedUtil from "./shared/util.js";
import * as pdfjsDisplayAPI from "./display/api.js";
import * as pdfjsDisplayTextLayer from "./display/text_layer.js";
import * as pdfjsDisplayAnnotationLayer from "./display/annotation_layer.js";
import * as pdfjsDisplaySVG from "./display/svg.js";
import * as pdfjsDisplayWorkerOptions from "./display/worker_options.js";
import * as pdfjsDisplayAPICompatibility from "./display/api_compatibility.js";
import * as pdfjsDisplayDisplayUtils from "./display/display_utils.js";
import { PDFNetworkStream } from "./display/network.js";
import { PDFFetchStream } from "./display/fetch_stream.js";


pdfjsDisplayAPI.setPDFNetworkStreamFactory(params => {
	if (PDFFetchStream && pdfjsDisplayDisplayUtils.isValidFetchUrl(params.url)) {
	  return new PDFFetchStream(params);
	}
	return new PDFNetworkStream(params);
});

export const build = pdfjsDisplayAPI.build;
export const version = pdfjsDisplayAPI.version;
export const getDocument = pdfjsDisplayAPI.getDocument;
export const LoopbackPort = pdfjsDisplayAPI.LoopbackPort;
export const PDFDataRangeTransport = pdfjsDisplayAPI.PDFDataRangeTransport;
export const PDFWorker = pdfjsDisplayAPI.PDFWorker;
export const renderTextLayer = pdfjsDisplayTextLayer.renderTextLayer;
export const AnnotationLayer = pdfjsDisplayAnnotationLayer.AnnotationLayer;
export const createPromiseCapability = pdfjsSharedUtil.createPromiseCapability;
export const PasswordResponses = pdfjsSharedUtil.PasswordResponses;
export const InvalidPDFException = pdfjsSharedUtil.InvalidPDFException;
export const MissingPDFException = pdfjsSharedUtil.MissingPDFException;
export const NativeImageDecoding = pdfjsSharedUtil.NativeImageDecoding;
export const CMapCompressionType = pdfjsSharedUtil.CMapCompressionType;
export const PermissionFlag = pdfjsSharedUtil.PermissionFlag;
export const UnexpectedResponseException = pdfjsSharedUtil.UnexpectedResponseException;
export const OPS = pdfjsSharedUtil.OPS;
export const VerbosityLevel = pdfjsSharedUtil.VerbosityLevel;
export const UNSUPPORTED_FEATURES = pdfjsSharedUtil.UNSUPPORTED_FEATURES;
export const createValidAbsoluteUrl = pdfjsSharedUtil.createValidAbsoluteUrl;
export const createObjectURL = pdfjsSharedUtil.createObjectURL;
export const removeNullCharacters = pdfjsSharedUtil.removeNullCharacters;
export const shadow = pdfjsSharedUtil.shadow;
export const Util = pdfjsSharedUtil.Util;
export const SVGGraphics = pdfjsDisplaySVG.SVGGraphics;
export const RenderingCancelledException = pdfjsDisplayDisplayUtils.RenderingCancelledException;
export const getFilenameFromUrl = pdfjsDisplayDisplayUtils.getFilenameFromUrl;
export const LinkTarget = pdfjsDisplayDisplayUtils.LinkTarget;
export const addLinkAttributes = pdfjsDisplayDisplayUtils.addLinkAttributes;
export const loadScript = pdfjsDisplayDisplayUtils.loadScript;
export const PDFDateString = pdfjsDisplayDisplayUtils.PDFDateString;
export const GlobalWorkerOptions = pdfjsDisplayWorkerOptions.GlobalWorkerOptions;
export const apiCompatibilityParams = pdfjsDisplayAPICompatibility.apiCompatibilityParams;
